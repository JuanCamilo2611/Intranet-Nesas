# Intranet empresarial Nexa — prototipo inicial

Interfaz de intranet para una fintech de cobranza o call center, desarrollada con HTML, CSS y JavaScript sin frameworks.

## Cómo abrirla
1. Descomprime la carpeta.
2. Abre `index.html` en Chrome, Edge o Firefox.
3. Navega desde el menú lateral.
4. Usa **Crear registro** para probar los formularios.
5. Utiliza la búsqueda para filtrar registros.

También puedes abrir la carpeta en Visual Studio Code y utilizar la extensión Live Server.

## Módulos incluidos
- Panel principal y accesos rápidos
- Manuales técnicos
- Matrices de calidad
- Actas y reuniones
- Rankings quincenales
- Historial de cierres
- Formularios para agregar registros
- Búsqueda por módulo y búsqueda general
- Diseño adaptable a móviles

## Importante: alcance de esta versión
Esta es una demostración frontend. Los registros se guardan en `localStorage` del navegador, no en un servidor compartido. Por eso, no se sincronizan entre empleados ni entre computadores, y no hay autenticación real, permisos, copias de seguridad ni auditoría segura. No cargues datos personales, financieros, de clientes o información interna confidencial.

Los archivos adjuntos todavía no se suben a un servidor; los módulos de rankings y actas son registros de metadatos, no un sistema de almacenamiento de archivos.

## Siguiente etapa para uso empresarial
Para producción, conectar una API/backend (por ejemplo, Python con Django o Flask), una base de datos, autenticación segura, roles de acceso, almacenamiento de documentos, copias de seguridad, registro de auditoría y despliegue HTTPS en infraestructura aprobada por la empresa.
