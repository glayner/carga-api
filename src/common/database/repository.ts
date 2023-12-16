import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

export interface Carga {
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

interface CreateOrUpdateLoadDataDTO {
  key: string;
  loadData: any;
}

interface CreateOrUpdateRequestDTO {
  key: string;
  type: "pre" | "pos";
  data?: any;
  error?: any;
}
interface AssignRequestByTypeDTO {
  obj: Carga;
  type: "pre" | "pos";
  data?: any;
  error?: any;
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

  private assignRequestByType({
    obj,
    type,
    data,
    error,
  }: AssignRequestByTypeDTO) {
    const requestFiel = type === "pre" ? "preRequest" : "posRequest";

    if (data) {
      obj[requestFiel].data.unshift(data);
    }
    if (error) {
      obj[requestFiel].error.unshift(error);
    }
  }

  async createOrUpdateLoadData({ key, loadData }: CreateOrUpdateLoadDataDTO) {
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

  async createOrUpdateRequest({
    key,
    type,
    data,
    error,
  }: CreateOrUpdateRequestDTO) {
    await this.db.read();
    const dataByKey = this.getByKey(key);

    if (dataByKey) {
      this.assignRequestByType({ obj: dataByKey, type, data, error });
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
      };
      this.assignRequestByType({ obj: defaultData, type, data, error });

      this.db.data.carga.push(defaultData);
    }

    await this.db.write();
  }

  async readLoadTestByKey(key: string) {
    await this.db.read();

    return this.getByKey(key);
  }

  async listLoadTestResult() {
    await this.db.read();
    return this.db.data.carga;
  }

  private validateDateToDelete(date: Date, register: Carga) {
    const validateDateReg = (reg: any) => {
      const regDate = new Date(reg.date);
      if (date <= regDate) {
        return reg;
      }
    };
    const loadData = register.loadData.map((reg) => {
      const regDate = new Date(reg.start);
      if (date <= regDate) {
        return reg;
      }
    }).filter(Boolean);
    const preReqData = register.preRequest.data
      .map(validateDateReg)
      .filter(Boolean);
    const preReqErr = register.preRequest.error
      .map(validateDateReg)
      .filter(Boolean);
    const posReqData = register.posRequest.data
      .map(validateDateReg)
      .filter(Boolean);
    const posReqErr = register.posRequest.error
      .map(validateDateReg)
      .filter(Boolean);

    if (
      !loadData[0] &&
      !preReqData[0] &&
      !preReqErr[0] &&
      !posReqData[0] &&
      !posReqErr[0]
    ) {
      return;
    }

    return {
      key: register.key,
      loadData,
      preRequest: { data: preReqData, error: preReqErr },
      posRequest: { data: posReqData, error: posReqErr },
    };
  }

  async deleteBeforeOf(date: Date) {
    await this.db.read();

    const newRegister = this.db.data.carga
      .map((register) => {
        return this.validateDateToDelete(date, register);
      })
      .filter(Boolean) as Carga[];

    this.db.data.carga = newRegister;
    await this.db.write();
  }
}

export default new RespositoryJson();
