type User = {
  id: string;
  username: string;
  email: string;
  gender: string;
  superadmin: boolean;
  country: string;
};

(async () => {
  const startTimestamp = Date.now();
  const dylib = Deno.dlopen("libread_bigdata.so", {
    user_has_admin: { parameters: ["buffer", "usize"], result: "pointer" },
  });

  const reader = await Deno.readTextFile("./data.json");
  const encoder = new TextEncoder();
  const data = encoder.encode(reader);

  const resultPtr = dylib.symbols.user_has_admin(data, BigInt(data.length));
  if (resultPtr) {
    const view = new Deno.UnsafePointerView(resultPtr);
    const text = JSON.parse(view.getCString());
    console.log(text);
  } else {
    console.error("Erro, ponteiro nullo");
  }
  const finalTimestamp = Date.now();
  console.log(
    `${finalTimestamp - startTimestamp}ms foi para gerar tudo isso aí`,
  );
})();
