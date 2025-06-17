window.addEventListener("DOMContentLoaded", function () {
  const table = $("#empresasTable").DataTable({
    ajax: {
      url: "http://localhost:3000/empresas",
      dataSrc: "",
    },
    columns: [
      { data: "razao_social" },
      { data: "fantasia" },
      { data: "cnpj" },
      {
        data: null,
        render: function (data, type, row) {
          return row.observacao ? "" : "Nenhuma observação";
        },
      },
      {
        data: null,
        className: "text-center",
        defaultContent:
          '<button class="btn btn-sm btn-primary visualizar">Ver</button>',
      },
    ],
  });

  $("#empresasTable tbody").on("click", "button.visualizar", function () {
    const data = table.row($(this).parents("tr")).data();

    fetch(`http://localhost:3000/empresas/${data.id}`)
      .then((res) => res.json())
      .then((empresa) => {
        $("#contatosList").empty();
        $("#anydeskList").empty();
        $("#servidoresList").empty();
        $("#helpdeskList").empty();

        empresa.contatos?.forEach((c) => {
          $("#contatosList").append(
            `<li class="list-group-item"><strong>${c.nome}:</strong> ${c.celular}</li>`
          );
        });

        empresa.anydesks?.forEach((a) => {
          $("#anydeskList").append(
            `<li class="list-group-item"><strong>${a.codigo}</strong> - ${
              a.descricao
            } (<a href="anydesk:${a.codigo.replaceAll(
              " ",
              ""
            )}" target="_blank">Abrir no anydesk</a>)</li>`
          );
        });

        empresa.servidores?.forEach((s) => {
          $("#servidoresList").append(
            `<li class="list-group-item"><strong>${s.host}</strong> - Usuário: ${s.user}, Senha: ${s.senha}</li>`
          );
        });

        empresa.helpdesk?.forEach((h) => {
          $("#helpdeskList").append(
            `<li class="list-group-item"><strong>${h.email}</strong> - Status: ${h.senha} <a href="https://proton.mysuite1.com.br/client/login.php/${h.email}" target="_blank">Abrir helpdesk</a></li>`
          );
        });

        const modal = new bootstrap.Modal(
          document.getElementById("detalhesModal")
        );
        modal.show();
      });
  });
});
