import * as pathfs from "node:path";
type User = {
  id: string;
  username: string;
  email: string;
  gender: string;
  superadmin: boolean;
  country: string;
};

const dylib = Deno.dlopen("./libread_bigdata.so", {
  user_has_admin: { parameters: ["buffer", "usize"], result: "pointer" },
  read_file: { parameters: ["buffer"], result: "pointer" },
});

(async () => {
  const startTimestamp = Date.now();

  const reader = await Deno.readTextFile("./data.json");
  const encoder = new TextEncoder();
  const data = encoder.encode(reader);

  const resultPtr = dylib.symbols.user_has_admin(data, BigInt(data.length));
  if (resultPtr) {
    const view = new Deno.UnsafePointerView(resultPtr);
    const text: User[] = JSON.parse(view.getCString());
    console.log(`Encontrados ${text.length} usuarios correspondentes`);
  } else {
    console.error("Erro, ponteiro nullo");
  }
  const finalTimestamp = Date.now();
  console.log(
    `${finalTimestamp - startTimestamp}ms de resposta de processamento`,
  );
});

(() => {
  const startTimestamp = Date.now();
  const encoder = new TextEncoder();
  const path = encoder.encode("./data.json" + "\0");
  const resultPtrRF = dylib.symbols.read_file(path);
  if (resultPtrRF) {
    const view = new Deno.UnsafePointerView(resultPtrRF);
    const encoder = new TextEncoder();
    const dataptr = encoder.encode(view.getCString());
    const resultPtrUHA = dylib.symbols.user_has_admin(
      dataptr,
      BigInt(dataptr.length),
    );
    if (resultPtrUHA) {
      const view = new Deno.UnsafePointerView(resultPtrUHA);
      const text: User[] = JSON.parse(view.getCString());
      console.log(`Encontrados ${text.length} usuarios correspondentes`);
    }
  }
  const finalTimestamp = Date.now();
  console.log(
    `${finalTimestamp - startTimestamp}ms de resposta de processamento`,
  );
})();
