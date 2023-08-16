import React, { FormEvent, useEffect, useState } from 'react'
import { getApiKey, saveApiKey } from '../store';

function Popup() {
  const [apiKey, setApiKey] = useState('')
  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    saveApiKey(apiKey);
  }

  useEffect(() => {
    (async () => {
      const key = await getApiKey();
      setApiKey(key)
    })()
  }, [])

  return (
    <form className='m-1' onSubmit={handleSubmit} >
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div className="relative">
        <input
          id="default-search"
          type="text"
          name="apikey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Input your gpt api key..."
          required
        />
        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
      </div>
    </form>
  )
}

export default Popup
