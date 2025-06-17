function passwords(password) {
  switch (password) {
    case "e10adc3949ba59abbe56e057f20f883e":
      return "123456";
    case "cf67f763b9b56c51a090924f6daa4abb":
      return "supp#2016";
    case "8b3b73e7bec6efb9bd3d6bc49d236196":
      return "supp@2014";
    case "c4ca4238a0b923820dcc509a6f75849b":
      return "1";
    default:
      return "Senha não encontrada";
  }
}

const criarLoginsDefault = async function () {
  try {
    const logins = await fetch("/data.json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!logins.ok) {
      throw new Error("Erro ao buscar data.json");
    }

    const response = await logins.json();
    const clientes = response.clientes;

    for (const { razao_social, email1, observacao, senha } of clientes) {
      const ativa =
        !razao_social.trim().startsWith("BL -") &&
        !razao_social.trim().startsWith("Inativo");

      const dados = {
        razao_social: razao_social,
        fantasia: "",
        cnpj: "",
        observacao: observacao,
        ativa: ativa,
      };

      try {
        const resEmpresa = await fetch("http://localhost:3000/empresas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });

        if (!resEmpresa.ok) {
          throw new Error("Erro ao criar empresa");
        }

        const empresaCriada = await resEmpresa.json();
        console.log("Empresa criada:", empresaCriada);

        const helpdeskData = {
          email: email1,
          senha: passwords(senha),
        };

        const resHelpdesk = await fetch(`http://localhost:3000/helpdesk/${empresaCriada.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(helpdeskData),
        });

        if (!resHelpdesk.ok) {
          throw new Error("Erro ao criar helpdesk");
        }

        console.log("Helpdesk criado:", await resHelpdesk.json());
      } catch (erroInterno) {
        console.error("Erro interno:", erroInterno);
      }
    }
  } catch (erroPrincipal) {
    console.error("Erro geral:", erroPrincipal);
  }
};

// criarLoginsDefault();
