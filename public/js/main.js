
$(document).ready(function () {
  const table = $('#empresasTable').DataTable();

  function carregarEmpresas() {
    fetch('http://localhost:3000/empresas')
      .then(res => res.json())
      .then(data => {
        table.clear();
        data.forEach(empresa => {
          table.row.add([
            empresa.id,
            empresa.nome,
            empresa.fantasia,
            empresa.cnpj,
            `<button class="btn btn-sm btn-info ver-btn" data-id="${empresa.id}">Ver</button>`
          ]);
        });
        table.draw();
      });
  }

  carregarEmpresas();

  $('#empresaForm').on('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const dados = Object.fromEntries(formData.entries());

    fetch('http://localhost:3000/empresas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })
      .then(res => res.json())
      .then(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('empresaModal'));
        modal.hide();
        this.reset();
        carregarEmpresas();
      });
  });
});
