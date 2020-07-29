# twitter_API
### ¿Qué hace?
Es una API que simula algunas de las funcionalidades de la red social Twitter. Todo se trabaja
en un solo comando, teniendo en cuenta la autenticación de usuarios, para que estos puedan realizar operaciones de lectura y escritura a la base de datos (Mongo DB). 

### ¿Cómo funciona?
**Funciona por medio de comandos en una sola ruta de peticiones**
1. Ingresamos a nuestra terminal en donde iniciaremos nuestra comunicación http

    //Comando para ejecutar el servidor
    **npm run start**

2. Utilizaremos una interfaz que nos permita interactuar con las peticiones, te recomiendo Postman o mongoCompass, para que puedas tener una experiencia agradable en las peticiones.

3. La lista de comandos son: 

    **REGISTER + nombreUsuario + password**  
    **LOGIN + nombreUsuario + password** (Es importante mencionar que debes copiar el token que este comando te retorna. El token es tu autenticación como usuario. No puedes efectuar una operación ajena a Register y Login sin el token, ya que el token es necesario para realizar otras operaciones).
    **PROFILE + nombreUsuario** (Puedes o no agregar el usuario. Si no agregas usuario te mostrará automáticamente tu perfil, de lo contrario te mostrará el perfil del usuario que desees).
    **ADD_TWEET + contenidoTweet**
    **EDIT_TWEET + idTweet + nuevoContenidoTweet**
    **VIEW_TWEETS + nombreUsuario** (Puedes o no agregar el usuario. Si no agregas usuario te mostrará automáticamente tus tweets, de lo contrario te mostrará los tweets del usuario que desees).
    **DELETE_TWEET + idTweet**
    **FOLLOW + nombreUsuario** (Cabe destacar que no puedes seguirte a ti mismo, existe una condición dentro del código que no te permite realizar dicha acción).
    **UNFOLLOW + nombreUsuario**
    **LIKE_TWEET + idTweet** (Este comando sirve para dar dislike también. Se evalúa si con anterioridad has hecho esta operación a un tweet en específico, si se encuentran resultados este comando puede eliminar tu like del tweet encontrado)
    **REPLY_TWEET + idTweet + respuesta**
    **RETWEET + idTweet + Comentario** (Este comando sirve para eliminar tu retweet también. Se evalúa si con anterioridad has hecho esta operación a un tweet en específico, si se encuentran resultados este comando puede eliminar tu retweet del tweet encontrado. El retweet puede efectuarse con o sin comentario, el comentario es opcional).
