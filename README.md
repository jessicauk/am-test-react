# Rick & Morty Characters App

### am-test-react

Aplicación desarrollada con **Next.js 14, React Server Components y Redux Toolkit** que muestra una galería de personajes de la serie Rick & Morty. Puedes marcar personajes como favoritos, buscar por nombre, navegar y explorar su información. Incluye test unitarios con Vitest.

---

## 🛠️ Instrucciones para correr el proyecto

### 1. Clona el repositorio

```bash

git clone https://github.com/jessicauk/am-test-react
cd am-test-react

```

### 2. Instala las dependencias

```bash

npm install

```
### 3. Correr el servidor frontend

```bash

npm run dev

```

### 4. Correr el servidor backend en otra terminal

```bash

npm run json-server

```

### 5. Correr test

```bash

npm run test
npm run test:cov

```

### ¿Qué es lo que más te gustó de TU desarrollo?
```bash

[-] Lo que más disfruté fue implementar toda la experiencia visual con personalizacion de efectos,  y trabajar con el diseño en general.

[-] También me gustó integrar Redux Toolkit para manejar el estado de la aplicación.
```

### ¿Si hubieras tenido más tiempo, ¿qué hubieras mejorado o agregado?

```bash

[-] Los estilos tal cual la especificación para el diseño del scroll.

[-] Hubiera agregado tal vez un paginador y una funcionalidad para ordenamiento de los personajes o filtros más especificos.

[-] También un overlay y un evento que ocultara la lista de favoritos.

[-] Agregar sonar para aumentar la calidad del código y verificar el coverage de las pruebas unitarias.

[-] Uso de variables de entorno para mayor seguridad.

[-] Remover algunos any type de los unit test.

[-] Remover el icono de ^ de las dependencias y dejarlas fijas a una versión para evitar futuros errores de compatibilidad de paquetes en caso de una actualización.

[-] Si la lista de personajes fuera mas grande podria aplicar virtualización de las cards con la libreria de react-virtualized y apoyado de GraphQL mejorar el performance de carga de datos.

[-] Añadiría un pipeline para automatizar las pruebas unitarias e integracion de codigo para hacer un deploy en un server gratuito como Heroku.

```

### ¿Con qué bug o pain point te encontraste y cómo lo solucionaste?

```bash
[-] Los estilos del scroll, para mostrar las flechas customizables, basicamente leyendo la documentacion del scroll.

[-] Al cear las pruebas unitarias me encontre con algunas dificultades ya que tenia que tuve que crear mocks de componentes y hooks, de esta manera logré simular el comportamiento de redux y componentes con lazy load.

[-] Otro de los mayores problemas es el error de "Hydration failed" al trabajar con datos cargados dinámicamente y elementos que dependían del cliente, como localStorage. Esto causaba que el HTML renderizado por el servidor no coincidiera con el del cliente. 

[-] La solución que encontre para ese error es usar un estado 'mounted' que se activa solo después del primer render en el cliente con useEffect. Esto asegura que el componente renderice el mismo contenido en servidor y cliente inicialmente, y luego cargue los datos de localStorage solo en el cliente. También agregué dynamic imports con ssr: false para componentes que dependen completamente del cliente.

[-] Ejemplo de implementación:

```
