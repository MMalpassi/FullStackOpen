import axios from 'axios'
import { useEffect, useState } from 'react'

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if(!name) return

    const fetchCountry = async () => {
        try {
            const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name.toLowerCase()}`)
            setCountry({found: true, data: response.data})
        } catch (error) {
            setCountry({found: false})
        }
    }

    fetchCountry()
  }, [name])

  return country
}

export default useCountry