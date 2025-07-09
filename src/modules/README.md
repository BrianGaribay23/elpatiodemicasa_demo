# Arquitectura Modular

Esta aplicación sigue una arquitectura modular para mejorar la organización, escalabilidad y mantenibilidad del código.

## Estructura de Módulos

```
src/modules/
├── academic/          # Gestión académica (clases, programas, horarios)
│   ├── components/    # Componentes específicos del módulo
│   ├── pages/        # Páginas del módulo
│   └── index.ts      # Exportaciones públicas del módulo
├── dashboard/        # Dashboard principal
│   ├── components/   
│   ├── pages/       
│   └── index.ts     
├── students/         # Gestión de estudiantes
│   ├── components/   
│   ├── pages/       
│   └── index.ts     
├── teachers/         # Gestión de profesores
│   ├── components/   
│   ├── pages/       
│   └── index.ts     
├── users/           # Gestión de usuarios general
│   ├── components/   
│   ├── pages/       
│   └── index.ts     
└── shared/          # Componentes y layouts compartidos
    ├── components/  # Componentes reutilizables
    ├── layouts/     # Layouts de la aplicación
    └── index.ts     
```

## Principios de Arquitectura

1. **Modularidad**: Cada módulo es independiente y contiene toda la lógica relacionada con su dominio.

2. **Encapsulación**: Los módulos solo exponen lo necesario a través de sus archivos `index.ts`.

3. **Reutilización**: Los componentes compartidos están en el módulo `shared`.

4. **Escalabilidad**: Nuevas características se pueden agregar como nuevos módulos sin afectar los existentes.

5. **Separación de Responsabilidades**: 
   - `components/`: Componentes UI específicos del módulo
   - `pages/`: Páginas/vistas completas del módulo
   - `hooks/`: Custom hooks (cuando sea necesario)
   - `services/`: Lógica de negocio y llamadas API (cuando sea necesario)
   - `types/`: Tipos TypeScript del módulo (cuando sea necesario)

## Convenciones de Importación

```typescript
// Importar desde un módulo
import { DashboardPage } from '@/modules/dashboard';

// Importar componentes compartidos
import { MainLayout, CalendarView } from '@/modules/shared';

// Importar componentes UI globales
import { Button, Card } from '@/components/ui';
```

## Agregar un Nuevo Módulo

1. Crear la estructura de carpetas:
   ```
   src/modules/[nombre-modulo]/
   ├── components/
   ├── pages/
   └── index.ts
   ```

2. Crear el archivo `index.ts` con las exportaciones públicas.

3. Desarrollar los componentes y páginas dentro del módulo.

4. Importar y usar el módulo en la aplicación principal.