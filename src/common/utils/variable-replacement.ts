export function replaceMarkers(data: any, variables: Record<string, any>) {
  if (typeof data === "string") {
    return replaceVariable(data, variables);
  } else if (Array.isArray(data)) {
    data = data.map((item) => replaceMarkers(item, variables));
  } else if (typeof data === "object" && data !== null) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = replaceMarkers(data[key], variables);
      }
    }
  }
  return data;
}

function replaceVariable(data: string, variables: Record<string, any>) {
  for (const key in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      if (data === `<<${key}>>`) {
        data = variables[key];
        break;
      } else if (data.includes(`<<${key}>>`)) {
        const regex = new RegExp(`<<${key}>>`, "g");
        data = data.replace(regex, variables[key]);
      }
    }
  }
  return data;
}
