export const getCookie = (
  cookies: string[],
  currentCookie: string,
  oldCookie?: [string[]]
): string => {
  let newCookie = currentCookie.concat(
    `${currentCookie ? ";" : ""}${cookies.map(c=> c.split(';')[0]).join(";")}`
  );

  if (oldCookie && oldCookie[0][0]) {
    const cookiesNamesPath = cookies.map((cookie) => {
      return getNamePath(cookie);
    });

    const cookiesToDelete: string[] = [];

    oldCookie.forEach((listCookies) => {
      listCookies.forEach((c) => {
        const { name, path } = getNamePath(c);

        const exists = cookiesNamesPath.find(
          (cookie) => cookie.name === name && cookie.path === path
        );

        if (exists) {
          cookiesToDelete.push(c.split(';')[0]);
        }
      });
    });

    cookiesToDelete.forEach((cookie) => {
      newCookie = newCookie.replace(`${cookie}`, "").replace(/;;/g, ';').replace(/^(?:;)|(?:;)+$/g, '');
    });
  }

  return newCookie;
};

const getNamePath = (cookie: string) => {
  const data = cookie.split(";");

  const name = data[0].split("=")[0];

  const pathIndex = data.findIndex(
    (d) => d.includes("Path=") || d.includes("path=")
  );

  const path = pathIndex >= 0 ? data[pathIndex].split("=")[1] : null;

  return { name, path };
};
