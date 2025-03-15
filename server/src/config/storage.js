const { storageService, checkSupabaseStorageConnection } = require('../utils/supabaseStorageService')

async function connectToStorage() {
 return new Promise(async (resolve, reject) => {
   try {
     const status = await checkSupabaseStorageConnection()
     console.log('Connection:', status)
     
     if (!status.connected) {
       reject(new Error('Failed to connect to storage'))
     }
     
     resolve(storageService)
   } catch (error) {
     reject(error)
   }
 })
}

module.exports = {
   storageService,
   connectToStorage
}