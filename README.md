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
### 2. Correr el servidor frontend

```bash

npm run dev

```

### 3. Correr el servidor backend en otra terminal

```bash

npm run json-server

```

### 4. Correr test

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

```

### ¿Con qué bug o pain point te encontraste y cómo lo solucionaste?

```bash
[-] Los estilos del scroll, para mostrar las flechas customizables, basicamente leyendo la documentacion del scroll.

[-] Otro de los mayores problemas es el error de "Hydration failed" al trabajar con datos cargados dinámicamente y elementos que dependían del cliente, como localStorage. Esto causaba que el HTML renderizado por el servidor no coincidiera con el del cliente. 

[-] La solución que encontre para ese error es envolver el acceso a localStorage dentro de una condición if '(typeof window !== 'undefined')' y manejé los datos con efecto useEffect para asegurarme de que sólo se cargaran del cliente después del render. Sin embargo sigo lidiando con ese error.

```
