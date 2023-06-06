# tfg-xavier
En este repositorio se encuentran todas las carpetas necesarias para abrir el proyecto al rededor del cual gira el trabajo, para ello habrá que instalar tambien node, npm ganache... todas las herramientas expuestas en la memoria. Una vez instaladas las herramientas y creada la carpeta donde se encuentren todos los ficheros del github, hay que realizar los siguientes pasos.
1. Loggearse en metamask
2. Abrir ganache , en quick start y introducir una de las keys en metamask para así tener tu cuenta de prueba con eth infinitos.
3. Ya en el entorno de ejecución, primero introduces un **truffle compile --all**, para así compilar todo el proyecto
4. Una vez compilado, **truffle deploy --all**, para desplegar el contrato
5. Finalmente, pones **npm run dev**, siendo esta linea la que abre en el navegador la web donde se ejecutara el contrato y podras realizar las transacciones
