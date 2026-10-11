// Rota ainda não implementada: responde 501 a qualquer método e não executa nada.
const naoImplementado = () => new Response(null, { status: 501 });
export { naoImplementado as GET, naoImplementado as POST, naoImplementado as PATCH, naoImplementado as DELETE };
