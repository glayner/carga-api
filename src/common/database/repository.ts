import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

interface Carga {
  key: string;
  loadData: any[];
  preRequest: {
    data: any[];
    error: any[];
  };
  posRequest: {
    data: any[];
    error: any[];
  };
}

interface Database {
  carga: Carga[];
}

interface CreateOrUpdateLoadDataDTO{
  key: string
  loadData: any
}

interface CreateOrUpdateRequestDTO{
  key: string
  type: 'pre' | 'pos'
  data?: any
  error?:any
}
interface AssignRequestByTypeDTO{
  obj: Carga
  type: 'pre' | 'pos'
  data?: any
  error?:any
}

 class RespositoryJson {
  private db: LowSync<Database>;

  constructor() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const file = join(__dirname, "../../..", "temp", "db.json");

    const adapter = new JSONFileSync<Database>(file);
    this.db = new LowSync<Database>(adapter, {
      carga: [
        {
          key: "",
          loadData: [],
          posRequest: { data: [], error: [] },
          preRequest: { data: [], error: [] },
        },
      ],
    });
  }

  private getByKey(key: string) {
    return this.db.data.carga.find((c) => c.key === key);
  }

  private assignRequestByType({obj,type,data,error}: AssignRequestByTypeDTO){
    const requestFiel = type === 'pre' ? 'preRequest': 'posRequest'

    if(data){
      obj[requestFiel].data.unshift(data)
    }
    if(error){
      obj[requestFiel].error.unshift(error)
    }
  }

  async createOrUpdateLoadData({key, loadData}: CreateOrUpdateLoadDataDTO) {
    await this.db.read();

    const dataByKey = this.getByKey(key);

    if (dataByKey) {
      dataByKey.loadData.unshift(loadData);

      this.db.data.carga.map((c) => (c.key === key ? dataByKey : c));
    } else {
      this.db.data.carga.push({
        key,
        loadData: [loadData],
        posRequest: {
          data: [],
          error: [],
        },
        preRequest: {
          data: [],
          error: [],
        },
      });
    }

    await this.db.write();
  }

  async createOrUpdateRequest({key, type, data, error}: CreateOrUpdateRequestDTO){
    await this.db.read();
    const dataByKey = this.getByKey(key);
   

    if (dataByKey) {
      this.assignRequestByType({obj:dataByKey,type,data,error})
      this.db.data.carga.map((c) => (c.key === key ? dataByKey : c));
    } else {
      const defaultData: Carga = {
        key,
        loadData: [],
        posRequest: {
          data: [],
          error: [],
        },
        preRequest: {
          data: [],
          error: [],
        },
      }
      this.assignRequestByType({obj:defaultData,type,data,error})

      this.db.data.carga.push(defaultData);
    }

    await this.db.write();
  }

  async readLoadTestByKey(key: string) {
    await this.db.read();

    return this.getByKey(key);
  }
}

export default new RespositoryJson()