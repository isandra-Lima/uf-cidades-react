import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [ufs,setUfs] = useState([]);
  const [cities,setCities] = useState([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedcity, setSelectedCity] = useState("0");

  useEffect(()=> {
    axios.get('https://brasilapi.com.br/api/ibge/uf/v1')
    .then(Response =>{
    setUfs(Response.data);
    });
  },[]);


  useEffect(()=> {
    axios.get(`https://brasilapi.com.br/api/ibge/municipios/v1/${selectedUf}?providers=dados-abertos-br,gov,wikipedia`)
    .then(Response =>{
     setCities(Response.data);
    });
  },[selectedUf]);

  function handleSelectedUf(event) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

   function handleSelectedcity(event) {
    const city = event.target.value;
    setSelectedCity(city);
  }


  return (
    <>
    <h1>Seletor de Uf e Cidades</h1>
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
        value = {selectedcity}
        onChange={handleSelectedcity}>
        <option value="0">Selecione a cidade</option>
        {cities.map(city =>(
          <option key={city.id} value={city.nome}>{city.nome}</option>
        ))}
      </select>
    </div>
    </>
  )
}

export default App
