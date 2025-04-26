echo "INSTALANDO O RUST"
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

echo "INSTALANDO O DENO"
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

echo "INICIANDO A BUILD DA LIB"
cargo build --release
cp ./target/release/libread_bigdata.so .

echo "INICIANDO O DENO"
deno index.ts