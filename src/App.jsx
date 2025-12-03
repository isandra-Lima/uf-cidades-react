import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [ufs,setUfs] = useState([]);
  const [cities,setCities] = useState([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedcity, setSelectedCity] = useState("0");
  const [infoUf, setInfoUf] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loadingUf, setLoadingUf] = useState(false);

  useEffect(()=> {
    axios.get('https://brasilapi.com.br/api/ibge/uf/v1')
    .then(Response =>{
      setUfs(Response.data);
    });
  },[]);

  useEffect(()=> {
    if (selectedUf === "0") return;
    axios.get(`https://brasilapi.com.br/api/ibge/municipios/v1/${selectedUf}?providers=dados-abertos-br,gov,wikipedia`)
    .then(Response =>{
      setCities(Response.data);
    });
  },[selectedUf]);

  function handleSelectedUf(event) {
    setSelectedUf(event.target.value);
  }

  function handleSelectedcity(event) {
    setSelectedCity(event.target.value);
  }

  async function mostrarInfoUF() {
    if (selectedUf === "0") {
      alert("Selecione uma UF primeiro!");
      return;
    }

    setLoadingUf(true);
    setOpenModal(true);
    setInfoUf(null);

    try {
      const r = await axios.get(`https://brasilapi.com.br/api/ibge/uf/v1/${selectedUf}`);
      setInfoUf(r.data);
    } catch (err) {
      console.log("Erro ao buscar UF:", err);
    } finally {
      setLoadingUf(false);
    }
  }

  return (
    <>
      <header className="header">
        <img src="/logo.png" alt="SearchCity Logo" className="logo-img" />
        <p className="api-text">API</p>
      </header>

      <div className="content">

        <div className="left">
          <h1>Encontre informações sobre<br></br>as Cidades do Brasil.</h1>

          <div className='container'>
            <select 
              name='Uf' 
              id='Uf'
              onChange={handleSelectedUf}>
              <option value="0">Selecione a UF</option>
              {ufs.map(uf =>(
                <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>
              ))}
            </select>

            <select 
              name='city' 
              id='city' 
              value={selectedcity}
              onChange={handleSelectedcity}>
              <option value="0">Selecione a cidade</option>
              {cities.map(city =>(
                <option key={city.id} value={city.nome}>{city.nome}</option>
              ))}
            </select>

            <button type="button" onClick={mostrarInfoUF}>
              Resultado
            </button>
          </div>
        </div>

        <div className="mapa-wrapper">
          <img src="/mapa.png" className='mapa-img' alt="Mapa do Brasil" />
        </div>

      </div>


      {openModal && (
        <div className="fundo" onClick={() => setOpenModal(false)}>
          <div className="caixa" onClick={(e) => e.stopPropagation()}>
            <button className="fechar" onClick={() => setOpenModal(false)}>X</button>

            <h2>Informações da UF</h2>

            {loadingUf && <p>Carregando...</p>}

            {infoUf && (
              <>
                <p><b>ID:</b> {infoUf.id}</p>
                <p><b>Sigla:</b> {infoUf.sigla}</p>
                <p><b>Nome:</b> {infoUf.nome}</p>

                <h3>Região</h3>
                <p><b>ID:</b> {infoUf.regiao.id}</p>
                <p><b>Sigla:</b> {infoUf.regiao.sigla}</p>
                <p><b>Nome:</b> {infoUf.regiao.nome}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default App
