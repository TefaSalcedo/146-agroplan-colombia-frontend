/**
 * Project Configuration for AgroPlan Colombia Competition
 * Contains all project information: repositories, creators, datasets, models, and open source software
 */

export const projectConfig = {
  // Project Information
  project: {
    name: "AgroPlan Colombia",
    description: "Sistema de inteligencia artificial que ayuda a agricultores y alcaldías en Colombia a decidir qué cultivar, cuándo sembrar y dónde, con zonificación agroclimática.",
    year: 2026,
    competition: "Datos Abiertos Colombia 2026"
  },

  // GitHub Repositories
  repositories: [
    {
      name: "Backend API",
      url: "https://github.com/TefaSalcedo/146-agroplan-colombia-backend",
      description: "API REST construida con FastAPI que sirve los endpoints de predicción, datos climáticos y catálogos de cultivos.",
      technology: "FastAPI, Python, PostgreSQL"
    },
    {
      name: "Frontend Web",
      url: "https://github.com/TefaSalcedo/146-agroplan-colombia-frontend",
      description: "Interfaz web responsiva construida con Next.js que permite a los usuarios interactuar con el sistema de planificación agrícola.",
      technology: "Next.js, TypeScript, Tailwind CSS"
    },
    {
      name: "Machine Learning Models",
      url: "https://github.com/TefaSalcedo/146-agroplan-colombia-ml",
      description: "Repositorio que contiene todo el ciclo de vida de los modelos de machine learning siguiendo la metodología CRISP-ML.",
      technology: "Python, Scikit-learn, TensorFlow"
    },
    {
      name: "MCP Server",
      url: "https://github.com/BOTOOM/146-datos-abiertos-mcp",
      description: "Model Context Protocol (MCP) server que integra los datos abiertos del gobierno colombiano con sistemas de IA.",
      technology: "TypeScript, MCP Protocol"
    }
  ],

  // Creators/Team
  creators: [
    {
      name: "Estefania Salcedo",
      role: "Lead Developer & ML Engineer",
      github: "https://github.com/TefaSalcedo",
      responsibilities: [
        "Desarrollo de modelos de machine learning para zonificación y rendimiento",
        "Implementación de backend con FastAPI",
        "Ingeniería de datos y preprocesamiento",
        "Integración de APIs externas (Open-Meteo, NASA POWER)"
      ]
    },
    {
      name: "Edwar Diaz",
      role: "Frontend Developer & System Architect",
      github: "https://github.com/BOTOOM",
      responsibilities: [
        "Desarrollo de interfaz web con Next.js",
        "Arquitectura del sistema MCP",
        "Integración de componentes de visualización",
        "Optimización de experiencia de usuario"
      ]
    }
  ],

  // Project Timeline/Steps
  timeline: [
    {
      phase: "Fase 1: Business Understanding",
      description: "Definición de objetivos del proyecto, identificación de cultivos prioritarios y evaluación de recursos disponibles.",
      deliverables: [
        "Documentación de objetivos de negocio",
        "Inventario de recursos",
        "Plan de proyecto"
      ]
    },
    {
      phase: "Fase 2: Data Understanding",
      description: "Exploración y análisis de datasets del concurso y fuentes complementarias. Análisis de calidad y viabilidad de datos.",
      deliverables: [
        "Documentación de lineage de datos",
        "Análisis exploratorio de datos (EDA)",
        "Diccionario de datos",
        "Validación de hipótesis de negocio"
      ]
    },
    {
      phase: "Fase 3: Data Preparation",
      description: "Limpieza, transformación y feature engineering de los datasets para el modelado.",
      deliverables: [
        "Datasets procesados y limpios",
        "Feature engineering documentado",
        "Preprocesadores para modelos"
      ]
    },
    {
      phase: "Fase 4: Model Engineering",
      description: "Desarrollo y entrenamiento de modelos de machine learning para zonificación agroclimática y predicción de rendimiento.",
      deliverables: [
        "Modelos entrenados y validados",
        "Métricas de evaluación",
        "Model cards documentados"
      ]
    },
    {
      phase: "Fase 5: Backend Development",
      description: "Implementación de API REST con FastAPI para servir predicciones y datos climáticos.",
      deliverables: [
        "API endpoints funcionales",
        "Integración con modelos de ML",
        "Sistema de sincronización climática"
      ]
    },
    {
      phase: "Fase 6: Frontend Development",
      description: "Desarrollo de interfaz web responsiva con Next.js para visualización y uso del sistema.",
      deliverables: [
        "Interfaz de usuario completa",
        "Visualización de mapas y calendarios",
        "Integración con backend"
      ]
    },
    {
      phase: "Fase 7: Deployment & Integration",
      description: "Despliegue de modelos en Hugging Face, configuración de MCP server y puesta en producción.",
      deliverables: [
        "Modelos publicados en Hugging Face",
        "Sistema MCP funcional",
        "Aplicación web en producción"
      ]
    }
  ],

  // Datasets from Datos Abiertos (Competition)
  datasets: [
    {
      name: "EVA - Evaluaciones Agrícolas",
      source: "UPRA (Unidad de Planificación de Tierras Rurales)",
      portal: "datos.gov.co",
      datasetId: "uejq-wxrr",
      url: "https://www.datos.gov.co/d/uejq-wxrr",
      description: "Evaluaciones agropecuarias municipales que proporcionan información histórica de producción agrícola a nivel municipal (2019-2024).",
      records: 141073,
      license: "Datos Abiertos Colombia",
      usage: "Variable objetivo para modelos de rendimiento agrícola"
    },
    {
      name: "Zonificación de Aptitud (15 cultivos)",
      source: "UPRA",
      portal: "datos.gov.co",
      datasets: [
        { id: "tx7u-frn2", crop: "Aguacate", url: "https://www.datos.gov.co/d/tx7u-frn2" },
        { id: "kwvf-nwea", crop: "Café", url: "https://www.datos.gov.co/d/kwvf-nwea" },
        { id: "8fa5-z4v3", crop: "Piña", url: "https://www.datos.gov.co/d/8fa5-z4v3" },
        { id: "jwn7-76wn", crop: "Papa", url: "https://www.datos.gov.co/d/jwn7-76wn" },
        { id: "2qt2-dhv7", crop: "Soya (Sem I)", url: "https://www.datos.gov.co/d/2qt2-dhv7" },
        { id: "hixf-wnis", crop: "Soya (Sem II)", url: "https://www.datos.gov.co/d/hixf-wnis" },
        { id: "btsg-jtqh", crop: "Cebolla (Sem I)", url: "https://www.datos.gov.co/d/btsg-jtqh" },
        { id: "nxvg-ufyf", crop: "Cebolla (Sem II)", url: "https://www.datos.gov.co/d/nxvg-ufyf" },
        { id: "frjn-92um", crop: "Maíz", url: "https://www.datos.gov.co/d/frjn-92um" },
        { id: "p9xp-sm4v", crop: "Caña Panelera", url: "https://www.datos.gov.co/d/p9xp-sm4v" },
        { id: "daig-46wa", crop: "Algodón", url: "https://www.datos.gov.co/d/daig-46wa" },
        { id: "emsg-94di", crop: "Fresa", url: "https://www.datos.gov.co/d/emsg-94di" },
        { id: "2e2z-wp9q", crop: "Caucho", url: "https://www.datos.gov.co/d/2e2z-wp9q" },
        { id: "349n-nd8f", crop: "Papaya", url: "https://www.datos.gov.co/d/349n-nd8f" },
        { id: "u4aa-xujw", crop: "Forestales", url: "https://www.datos.gov.co/d/u4aa-xujw" }
      ],
      description: "Datasets de zonificación de aptitud de suelo para diferentes cultivos, proporcionando información espacial de adecuación del suelo.",
      totalRecords: 365000,
      license: "Datos Abiertos Colombia",
      usage: "Variable objetivo para modelos de zonificación agroclimática"
    },
    {
      name: "Suelos AGROSAVIA",
      source: "AGROSAVIA (Corporación Colombiana de Investigación Agropecuaria)",
      portal: "datos.gov.co",
      datasetId: "ch4u-f3i5",
      url: "https://www.datos.gov.co/d/ch4u-f3i5",
      description: "Datos de suelos a nivel nacional con información química y física del suelo.",
      records: 11000,
      license: "Datos Abiertos Colombia",
      usage: "Variables predictoras para modelos de zonificación"
    },
    {
      name: "DIVIPOLA",
      source: "DANE (Departamento Administrativo Nacional de Estadística)",
      portal: "datos.gov.co",
      description: "División Político-Administrativa de Colombia con información de departamentos y municipios.",
      usage: "Georreferenciación y ubicación de datos agrícolas"
    }
  ],

  // External Open Data Sources (Not from competition)
  externalDataSources: [
    {
      name: "NASA POWER - Clima",
      source: "NASA POWER Project",
      url: "https://power.larc.nasa.gov/api/temporal/daily/point",
      description: "Datos climáticos diarios (temperatura, precipitación, humedad, radiación solar) para 32 departamentos de Colombia (2019-2024).",
      records: 70000,
      license: "NASA Open Data",
      usage: "Variables climáticas para modelos de predicción"
    },
    {
      name: "FAO Crop Calendar",
      source: "Food and Agriculture Organization (FAO)",
      url: "https://data.apps.fao.org/catalog/dataset/crop-calendar-by-country-crop-activity-and-stage",
      description: "Calendario de cultivos FAO con información fenológica de siembra y cosecha por país, cultivo y zona agroecológica.",
      records: 248,
      license: "CC-BY-3.0-IGO",
      usage: "Validación de calendarios de siembra y cosecha"
    },
    {
      name: "EcoCrop (OpenCLIM)",
      source: "FAO / OpenCLIM",
      url: "https://data.apps.fao.org/catalog/dataset/ecocrop",
      description: "Base de datos de requerimientos ecológicos de 2,568 especies de cultivos.",
      records: 2568,
      license: "CC-BY-4.0",
      usage: "Validación de requerimientos ecológicos de cultivos"
    },
    {
      name: "GEOGLAM Crop Monitor",
      source: "GEOGLAM",
      url: "https://zenodo.org/records/15850408",
      description: "Calendarios subnacionales de cultivos para validación de cobertura fenológica.",
      records: 1500,
      license: "CC-BY-4.0",
      usage: "Benchmark de cobertura (limitado para Colombia)"
    }
  ],

  // Hugging Face Models
  huggingFaceModels: [
    {
      name: "AgroPlan Zonificación",
      url: "https://huggingface.co/SRBOTOM/agroplan-zonificacion",
      description: "Modelo de machine learning para zonificación agroclimática de cultivos. Incluye modelo compilado, preprocesadores y datasets necesarios.",
      type: "Classification Model",
      framework: "Scikit-learn / TensorFlow",
      crops: ["Aguacate", "Piña", "Cebolla", "Soya", "Algodón", "Fresa", "Caña Panelera"]
    },
    {
      name: "AgroPlan Rendimiento",
      url: "https://huggingface.co/SRBOTOM/agroplan-rendimiento",
      description: "Modelo de machine learning para predicción de rendimiento agrícola basado en condiciones climáticas y de suelo.",
      type: "Regression Model",
      framework: "Scikit-learn / TensorFlow",
      crops: ["Aguacate", "Piña", "Cebolla", "Soya", "Algodón", "Fresa", "Caña Panelera"]
    }
  ],

  // Open Source Software Acknowledgments
  openSourceSoftware: [
    {
      name: "Open-Meteo",
      url: "https://open-meteo.com/",
      description: "API gratuita de datos meteorológicos que proporciona pronósticos climáticos precisos para cualquier ubicación del mundo.",
      license: "Open Source (Free for non-commercial use)",
      usage: "Pronósticos climáticos en tiempo real para la aplicación"
    },
    {
      name: "MapLibre GL",
      url: "https://maplibre.org/",
      description: "Biblioteca de mapas open source para visualización de mapas interactivos en aplicaciones web.",
      license: "BSD-3-Clause",
      usage: "Visualización de mapas de zonificación agrícola"
    },
    {
      name: "FastAPI",
      url: "https://fastapi.tiangolo.com/",
      description: "Framework moderno y rápido para construir APIs con Python 3.7+.",
      license: "MIT",
      usage: "Backend API del proyecto"
    },
    {
      name: "Next.js",
      url: "https://nextjs.org/",
      description: "Framework de React para aplicaciones web con renderizado del lado del servidor.",
      license: "MIT",
      usage: "Frontend web del proyecto"
    },
    {
      name: "TensorFlow",
      url: "https://www.tensorflow.org/",
      description: "Biblioteca open source para machine learning e inteligencia artificial.",
      license: "Apache-2.0",
      usage: "Entrenamiento de modelos de ML"
    },
    {
      name: "Scikit-learn",
      url: "https://scikit-learn.org/",
      description: "Biblioteca de machine learning para Python con herramientas para clasificación, regresión y clustering.",
      license: "BSD-3-Clause",
      usage: "Algoritmos de ML y preprocesamiento"
    },
    {
      name: "PostgreSQL",
      url: "https://www.postgresql.org/",
      description: "Sistema de base de datos relacional open source potente y robusto.",
      license: "PostgreSQL License",
      usage: "Almacenamiento de datos y catálogos"
    },
    {
      name: "GSAP (GreenSock)",
      url: "https://greensock.com/gsap/",
      description: "Biblioteca de animación JavaScript profesional para el web.",
      license: "Standard (Free for web use)",
      usage: "Animaciones en la interfaz de usuario"
    }
  ],

  // Technical Stack Summary
  techStack: {
    backend: {
      language: "Python",
      framework: "FastAPI",
      database: "PostgreSQL",
      ml: ["TensorFlow", "Scikit-learn", "Pandas", "NumPy"]
    },
    frontend: {
      language: "TypeScript",
      framework: "Next.js 16.2.6",
      styling: "Tailwind CSS",
      maps: "MapLibre GL",
      animation: "GSAP"
    },
    deployment: {
      models: "Hugging Face",
      hosting: "Vercel (Frontend)",
      protocol: "MCP (Model Context Protocol)"
    }
  }
}
