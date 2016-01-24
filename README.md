# perfilResolve
Esta es una app para prueba de conocimientos

#Pasos para probar la aplicación

1. Descargar y descomprimir el archivo

2. crear una base de datos en postgres y cambiar las configuraciones pertinentes en el archivo .env

3. Correr las migraciones con el comando:
	php artisan migrate

4. Guardar los registros que vienen por defecto en los seeder con el comando:
	php artisan db:seed

5. ejecutar la aplicación con:
	php artisan serve
