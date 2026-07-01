import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "./ConfiguracoesEmpresa.css";
import { Upload } from "lucide-react";

const API = "/api";

function ConfiguracoesEmpresa() {
  const [empresa, setEmpresa] = useState({
    logo: "",
    nomeFantasia: "",
    razaoSocial: "",
    documento: "",
    telefone: "",
    whatsapp: "",
    email: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    mensagem: "Obrigado pela preferência! Volte sempre."
  });

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  async function carregarConfiguracoes() {
    try {
      const empresaId = localStorage.getItem("empresaId");
      const resposta = await fetch(`${API}/configuracoes?empresa_id=${empresaId}`);
      const dados = await resposta.json();

      if (!dados) return;

      const endereco = dados.endereco ? JSON.parse(dados.endereco) : {};

      setEmpresa({
        logo: dados.logo || "",
        nomeFantasia: dados.nome_empresa || "",
        razaoSocial: dados.razao_social || "",
        documento: dados.cnpj || "",
        telefone: dados.telefone || "",
        whatsapp: dados.whatsapp || "",
        email: dados.email || "",
        cep: endereco.cep || "",
        rua: endereco.rua || "",
        numero: endereco.numero || "",
        bairro: endereco.bairro || "",
        cidade: endereco.cidade || "",
        estado: endereco.estado || "",
        mensagem: dados.rodape_comprovante || "Obrigado pela preferência! Volte sempre."
      });
    } catch (erro) {
      console.log("Erro ao carregar configurações:", erro);
    }
  }

  function alterar(e) {
    setEmpresa({
      ...empresa,
      [e.target.name]: e.target.value
    });
  }

  async function salvar() {
    try {
      const empresaId = localStorage.getItem("empresaId");
      const endereco = {
        cep: empresa.cep,
        rua: empresa.rua,
        numero: empresa.numero,
        bairro: empresa.bairro,
        cidade: empresa.cidade,
        estado: empresa.estado
      };

      const resposta = await fetch(`${API}/configuracoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          empresa_id: empresaId,
          nome_empresa: empresa.nomeFantasia,
          razao_social: empresa.razaoSocial,
          telefone: empresa.telefone,
          whatsapp: empresa.whatsapp,
          email: empresa.email,
          endereco: JSON.stringify(endereco),
          cnpj: empresa.documento,
          logo: empresa.logo,
          rodape_comprovante: empresa.mensagem
        })
      });

      if (!resposta.ok) {
        alert("Erro ao salvar configurações.");
        return;
      }

      alert("Configurações salvas.");
    } catch (erro) {
      console.log("Erro ao salvar configurações:", erro);
      alert("Erro ao salvar configurações.");
    }
  }

  return (
    <MainLayout>
      <div className="empresa-page">
        <div className="empresa-header">
          <div>
            <h1>Empresa</h1>
            <p>
              Preencha os dados da sua empresa. Essas informações aparecerão automaticamente
              no comprovante de venda.
            </p>
          </div>
        </div>

        <div className="empresa-card">
          <div className="logo-upload">
            {empresa.logo ? (
              <img src={empresa.logo} className="preview-logo" alt="" />
            ) : (
              <div className="preview-logo">
                <Upload size={48} strokeWidth={1.8} />
              </div>
            )}

            <div>
              <h3>Logo da Empresa</h3>
              <p>Adicione a logo que será utilizada nos comprovantes e relatórios.</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const arquivo = e.target.files[0];
                  if (!arquivo) return;

                  const reader = new FileReader();
                  reader.onload = () => {
                    setEmpresa({
                      ...empresa,
                      logo: reader.result
                    });
                  };
                  reader.readAsDataURL(arquivo);
                }}
              />
            </div>
          </div>

          <h2 className="empresa-section">Dados da Empresa</h2>

          <input
            name="nomeFantasia"
            placeholder="Nome Fantasia"
            value={empresa.nomeFantasia}
            onChange={alterar}
          />

          <input
            name="razaoSocial"
            placeholder="Razão Social"
            value={empresa.razaoSocial}
            onChange={alterar}
          />

          <input
            name="documento"
            placeholder="CPF ou CNPJ"
            value={empresa.documento}
            onChange={(e) => {
              let valor = e.target.value.replace(/\D/g, "");
              valor = valor.slice(0, 14);

              if (valor.length <= 11) {
                valor = valor
                  .replace(/(\d{3})(\d)/, "$1.$2")
                  .replace(/(\d{3})(\d)/, "$1.$2")
                  .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
              } else {
                valor = valor
                  .replace(/^(\d{2})(\d)/, "$1.$2")
                  .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                  .replace(/\.(\d{3})(\d)/, ".$1/$2")
                  .replace(/(\d{4})(\d)/, "$1-$2");
              }

              setEmpresa({
                ...empresa,
                documento: valor
              });
            }}
          />

          <input
            name="telefone"
            placeholder="Telefone"
            value={empresa.telefone}
            onChange={(e) => {
              let valor = e.target.value.replace(/\D/g, "");
              valor = valor.slice(0, 11);
              valor = valor
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(/(\d)(\d{4})$/, "$1-$2");

              setEmpresa({
                ...empresa,
                telefone: valor
              });
            }}
          />

          <input
            name="whatsapp"
            placeholder="WhatsApp"
            value={empresa.whatsapp}
            onChange={(e) => {
              let valor = e.target.value.replace(/\D/g, "");
              valor = valor.slice(0, 11);
              valor = valor
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(/(\d)(\d{4})$/, "$1-$2");

              setEmpresa({
                ...empresa,
                whatsapp: valor
              });
            }}
          />

          <input
            name="email"
            placeholder="Email"
            value={empresa.email}
            onChange={alterar}
          />

          <h2 className="empresa-section">Endereço</h2>

          <input
            name="cep"
            placeholder="CEP"
            value={empresa.cep}
            onChange={async (e) => {
              let cep = e.target.value.replace(/\D/g, "");
              cep = cep.slice(0, 8);

              if (cep.length > 8) return;

              setEmpresa({
                ...empresa,
                cep
              });

              if (cep.length === 8) {
                try {
                  const dados = await fetch(
                    `https://viacep.com.br/ws/${cep}/json/`
                  ).then((r) => r.json());

                  if (!dados.erro) {
                    setEmpresa((prev) => ({
                      ...prev,
                      cep,
                      rua: dados.logradouro || "",
                      bairro: dados.bairro || "",
                      cidade: dados.localidade || "",
                      estado: dados.uf || ""
                    }));
                  }
                } catch (e) {
                  console.log("Erro ao buscar CEP");
                }
              }
            }}
          />

          <input
            name="rua"
            placeholder="Rua"
            value={empresa.rua}
            onChange={alterar}
          />

          <input
            name="numero"
            placeholder="Número"
            value={empresa.numero}
            onChange={alterar}
          />

          <input
            name="bairro"
            placeholder="Bairro"
            value={empresa.bairro}
            onChange={alterar}
          />

          <input
            name="cidade"
            placeholder="Cidade"
            value={empresa.cidade}
            onChange={alterar}
          />

          <select
            name="estado"
            value={empresa.estado}
            onChange={alterar}
          >
            <option value="">UF</option>
            <option value="AC">AC</option>
            <option value="AL">AL</option>
            <option value="AP">AP</option>
            <option value="AM">AM</option>
            <option value="BA">BA</option>
            <option value="CE">CE</option>
            <option value="DF">DF</option>
            <option value="ES">ES</option>
            <option value="GO">GO</option>
            <option value="MA">MA</option>
            <option value="MT">MT</option>
            <option value="MS">MS</option>
            <option value="MG">MG</option>
            <option value="PA">PA</option>
            <option value="PB">PB</option>
            <option value="PR">PR</option>
            <option value="PE">PE</option>
            <option value="PI">PI</option>
            <option value="RJ">RJ</option>
            <option value="RN">RN</option>
            <option value="RS">RS</option>
            <option value="RO">RO</option>
            <option value="RR">RR</option>
            <option value="SC">SC</option>
            <option value="SP">SP</option>
            <option value="SE">SE</option>
            <option value="TO">TO</option>
          </select>

          <h2 className="empresa-section">Comprovante de Venda</h2>

          <label className="campo-label">
            Mensagem de agradecimento para o comprovante
          </label>

          <textarea
            name="mensagem"
            rows="3"
            placeholder="Ex.: Obrigado pela preferência! Volte sempre."
            value={empresa.mensagem}
            onChange={alterar}
          />

          <small className="campo-ajuda">
            Essa mensagem aparecerá automaticamente no final do comprovante de venda.
          </small>

          <button className="salvar-empresa" onClick={salvar}>
            Salvar Configurações
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default ConfiguracoesEmpresa;