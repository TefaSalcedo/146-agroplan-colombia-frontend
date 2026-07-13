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
    }
  ],

  // Creators/Team
  creators: [
    {
      name: "Estefania Salcedo",
      role: "Lead Developer, Data Scientist & Data Engineer",
      github: "https://github.com/TefaSalcedo",
      avatar: "https://avatars.githubusercontent.com/u/122816145?v=4",
      responsibilities: [
        "Preparación y análisis de más del 90% de los datos para los modelos",
        "Ingeniería de datos sobre clima, suelos, cultivos, NASA POWER y fuentes complementarias",
        "Desarrollo del backend con FastAPI e integración de APIs externas",
        "Desarrollo del frontend y optimización de la experiencia de usuario"
      ]
    },
    {
      name: "Edwar Diaz",
      role: "Backend Developer, ML Engineer & System Architect",
      github: "https://github.com/BOTOOM",
      avatar: "https://avatars.githubusercontent.com/u/28914781?v=4",
      responsibilities: [
        "Diseño, entrenamiento y fine-tuning de los modelos de machine learning",
        "Creación de versiones optimizadas y análisis de métricas",
        "Arquitectura del sistema y despliegue de los componentes",
        "Creación e integración del MCP para la puesta en producción"
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
      description: "Creación de modelos base y modelos ajustados con AutoML y Optuna para zonificación y predicción de rendimiento. Se usó SHAP para identificar las features más importantes y construir versiones optimizadas con menos variables.",
      deliverables: [
        "Dos modelos de zonificación, dos modelos de rendimiento en ensamble y un modelo KNN de recomendaciones",
        "Modelos base, fine-tuned y optimizados",
        "Métricas iniciales y análisis de importancia de features con SHAP"
      ]
    },
    {
      phase: "Fase 5: ML Evaluation & Interpretability",
      description: "Evaluación formal de los modelos con las métricas apropiadas para cada tarea: R² y RMSE para rendimiento, y F1 macro para clasificación. Esta fase concentra la evaluación adicional y la interpretación de resultados.",
      deliverables: [
        "Evaluación comparativa de modelos",
        "Métricas R², RMSE y F1 macro según el caso",
        "Interpretación de resultados y selección de candidatos"
      ]
    },
    {
      phase: "Fase 6: Backend Deployment",
      description: "Despliegue del backend y sus servicios en Coolify sobre un VPS, con integración de los modelos y las fuentes de datos.",
      deliverables: [
        "API desplegada en Coolify",
        "Integración de modelos y servicios",
        "Configuración operativa del backend"
      ]
    },
    {
      phase: "Fase 7: Frontend Deployment",
      description: "Publicación del frontend y conexión con el backend desplegado para entregar la experiencia web completa.",
      deliverables: [
        "Aplicación web publicada",
        "Integración con la API productiva",
        "Validación de mapas, calendarios y flujos principales"
      ]
     },
     {
      phase: "Fase 8: Model Registry, MCP & Production Integration",
      description: "Almacenamiento de modelos, datasets y artefactos en Hugging Face; configuración del MCP según el entorno y puesta en producción integral del sistema.",
      deliverables: [
        "Modelos y artefactos publicados en Hugging Face",
        "MCP auto-hospedado según las necesidades del entorno",
        "Integración y puesta en producción total del sistema"
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
      url: "https://power.larc.nasa.gov/data-access-viewer/",
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

  // Machine Learning Models
  huggingFaceModels: [
    {
      name: "AgroPlan Zonificación",
      description: "Modelos de zonificación agroclimática para los 7 cultivos disponibles. LightGBM es el modelo principal, CatBoost funciona como modelo secundario y KNN genera recomendaciones de cultivos similares.",
      type: "Classification Model",
      framework: "LightGBM + CatBoost + KNN",
      crops: ["Aguacate", "Piña", "Cebolla", "Soya", "Algodón", "Fresa", "Caña Panelera"]
    },
    {
      name: "AgroPlan Rendimiento",
      description: "Ensamble de modelos para predecir el rendimiento agrícola de 94 cultivos. Combina XGBoost y LightGBM para aprovechar sus fortalezas complementarias.",
      type: "Regression Ensemble",
      framework: "XGBoost + LightGBM",
      crops: ["7 cultivos de zonificación", "87 cultivos adicionales", "94 cultivos en total"]
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
    },
    {
      name: "Coolify",
      url: "https://coolify.io/",
      description: "Plataforma open source para desplegar y administrar servicios en infraestructura propia.",
      license: "Apache-2.0",
      usage: "Despliegue del backend en un VPS"
    }
  ],

  // Technical Stack Summary
  techStack: {
    backend: {
      language: "Python",
      framework: "FastAPI",
      database: "PostgreSQL",
      ml: ["Scikit-learn", "Pandas", "NumPy", "LightGBM", "XGBoost", "CatBoost", "Joblib", "SHAP", "AutoML / Optuna"]
    },
    frontend: {
      language: "TypeScript",
      framework: "Next.js 16.2.6",
      styling: "Tailwind CSS",
      maps: "MapLibre GL",
      animation: "GSAP"
    },
    deployment: {
      models: "Hugging Face: modelos, datasets y artefactos",
      hosting: "Frontend en Vercel · Backend en Coolify sobre un VPS",
      protocol: "MCP auto-hospedado según el entorno"
    }
  }
}
