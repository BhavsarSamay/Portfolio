export const projectCategories = [
  "All",
  "AI & LLM",
  "Full-Stack",
  "Product Systems"
];

export const earlierProjects = [
  {
    id: "siteassist",
    title: 'SiteAssist: Full-Stack RAG Chat Platform',
    category: "AI & Full-Stack",
    tagline: 'Multi-tenant Conversational AI Engine with Real-Time WebSockets & RAG Ingestion',
    description: 'A comprehensive full-stack chat ecosystem combining a Node.js REST and WebSocket API, two distinct React client applications (Super-Admin Console & End-User Client Panel), an embeddable customer-facing widget, and a LangChain RAG pipeline with Firebase push messaging.',
    tech: ['Node.js', 'React.js', 'MongoDB', 'Socket.io', 'LangChain', 'Firebase', 'Swagger', 'JWT', 'Tailwind CSS'],
    href: 'https://github.com/BhavsarSamay/SiteAssist',
    githubUrl: 'https://github.com/BhavsarSamay/SiteAssist',
    metrics: 'Client & Admin React Panels · Real-time WebSockets · Sub-120ms Latency',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    problemStatement: 'Modern businesses struggle to deliver context-aware, 24/7 customer support without ballooning headcounts or relying on disjointed third-party SaaS chat tools that cannot query custom internal knowledge bases in real time.',
    architecture: 'Embed Widget / Dual React Panels -> Express & Socket.io Gateway -> MongoDB Storage -> Vector Embeddings & LangChain RAG -> Firebase FCM Dispatch',
    pipelineStages: [
      { name: 'Client & Embed Widget', desc: 'Lightweight iframe/script embed with cross-origin handshake & JWT session auth' },
      { name: 'Gateway & Socket Cluster', desc: 'Real-time duplex communication engine managing active rooms and presence states' },
      { name: 'RAG Knowledge Pipeline', desc: 'Vector similarity search over ingested business docs with grounded context injection' },
      { name: 'Persistence & Dispatch', desc: 'MongoDB session history paired with Firebase Cloud Messaging for offline notifications' }
    ],
    challenges: [
      {
        title: 'Connection Stability & Fallbacks',
        desc: 'Engineered automatic reconnect with message queueing to prevent message drops over flaky mobile networks.'
      },
      {
        title: 'Contextual RAG Retrieval Latency',
        desc: 'Optimized vector chunking and token budgets to achieve sub-second generation without sacrificing answer grounding.'
      },
      {
        title: 'Dual-Portal Role Segregation',
        desc: 'Enforced granular RBAC dividing tenant administrator privileges from global super-admin oversight.'
      }
    ],
    stats: [
      { value: '2 Frontends', label: 'Client & Super-Admin' },
      { value: '<120ms', label: 'WebSocket RTT' },
      { value: '100%', label: 'Grounded RAG Answers' },
      { value: 'REST + WS', label: 'Hybrid Protocol' }
    ],
    techStack: {
      frontend: ['React 18', 'Tailwind CSS', 'Vite', 'Socket.io-client', 'Lucide Icons'],
      backend: ['Node.js', 'Express.js', 'Socket.io', 'JWT Auth', 'Swagger OpenAPI'],
      dataAI: ['MongoDB', 'Mongoose', 'LangChain.js', 'OpenAI Embeddings'],
      infrastructure: ['Firebase FCM', 'Docker', 'RESTful APIs']
    },
    highlights: [
      'Engineered an embeddable customer chat widget with real-time socket connections and Firebase push messaging',
      'Architected two independent React frontends: client user panel and super-admin dashboard for management & analytics',
      'Integrated Retrieval-Augmented Generation (RAG) backend with centralized Swagger/OpenAPI documentation and migration scripts'
    ],
    codeSnippet: `// SiteAssist: Socket.io Real-time Connection & RAG Ingestion Pipeline
io.on("connection", (socket) => {
  socket.on("join_room", ({ clientId, sessionId }) => {
    socket.join(\`session:\${sessionId}\`);
    logger.info(\`Client \${clientId} joined session \${sessionId}\`);
  });

  socket.on("send_message", async (data) => {
    // 1. Persist inbound message to MongoDB
    await chatRepository.saveMessage(data);

    // 2. Query vectorized knowledge base via LangChain RAG
    const ragResponse = await ragService.generateContextualReply({
      query: data.text,
      sessionId: data.sessionId,
      tenantId: data.tenantId
    });

    // 3. Emit grounded answer to room & dispatch push notification
    io.to(\`session:\${data.sessionId}\`).emit("receive_message", ragResponse);
    if (!data.clientActive) {
      await fcmService.sendPushNotification(data.clientId, ragResponse.summary);
    }
  });
});`
  },
  {
    id: "agentic-ai",
    title: 'Agentic AI Autonomous TODO System',
    category: "AI & LLM",
    tagline: 'Self-Directing Agentic Workflow Engine with Dynamic Tool Invocation & Re-Planning',
    description: 'Fully autonomous AI agent built on LangChain (JavaScript) that dynamically decomposes unstructured high-level human goals into structured subtasks, selects corresponding system tools, and executes multi-step plans with persistent memory context and automated failure recovery.',
    tech: ['LangChain.js', 'Node.js', 'OpenAI API', 'Tool Calling', 'JavaScript', 'Vector Memory'],
    href: 'https://github.com/BhavsarSamay/Agentic_AI_Todo',
    githubUrl: 'https://github.com/BhavsarSamay/Agentic_AI_Todo',
    metrics: 'Autonomous goal decomposition · Intelligent re-planning on subtask failure',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    problemStatement: 'Traditional task management requires tedious manual breaking down of projects into subtasks, calendar scheduling, and tool coordination, leading to execution inertia and planning bottlenecks.',
    architecture: 'Goal Input -> LLM Decomposition Planner -> Tool Calling Executor -> State & Memory Store -> Self-Healing Evaluator',
    pipelineStages: [
      { name: 'Intent & Decomposition', desc: 'Parses complex natural language goals into an ordered Directed Acyclic Graph (DAG) of sub-actions' },
      { name: 'Tool Selection Matrix', desc: 'Evaluates tool schemas (file ops, external APIs, task schedulers) and executes step parameters' },
      { name: 'Execution & Reflection', desc: 'Validates tool outputs against sub-goal criteria; initiates alternate branch planning on failure' },
      { name: 'Memory & State Synchronization', desc: 'Persists context and scratchpad logs across multi-step execution chains' }
    ],
    challenges: [
      {
        title: 'Hallucination Mitigation in Tool Calling',
        desc: 'Implemented strict Pydantic/Zod-style schema validators ensuring model parameters conform exactly to tool signatures.'
      },
      {
        title: 'Cycle Detection & Self-Healing',
        desc: 'Built an execution supervisor that monitors iteration counts and re-prompts the model with error telemetry if a tool fails.'
      },
      {
        title: 'Context Window Optimization',
        desc: 'Employed rolling summary memory to retain execution history across long reasoning chains without overflowing token limits.'
      }
    ],
    stats: [
      { value: '5 Max Loops', label: 'Controlled Reasoning' },
      { value: 'Zero-Shot', label: 'Tool Schema Binding' },
      { value: 'Self-Healing', label: 'Error Recovery' },
      { value: 'DAG', label: 'Task Execution' }
    ],
    techStack: {
      frontend: ['CLI Terminal Interface', 'Web Dashboard'],
      backend: ['Node.js', 'ES Modules', 'LangChain Agent Executor'],
      dataAI: ['OpenAI GPT-4o', 'Tool Calling API', 'Structured Schemas'],
      infrastructure: ['Local Execution Engine', 'Git Version Control']
    },
    highlights: [
      'Built a fully autonomous AI agent using LangChain (JavaScript) that decomposes user goals into subtasks',
      'Selects appropriate tools and executes multi-step plans with persistent context memory',
      'Self-healing execution pipeline with automatic re-planning when subtasks fail'
    ],
    codeSnippet: `// Agentic Planner: Dynamic Goal Decomposition & Tool Invocation
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";

export async function runAgenticWorkflow(userGoal, availableTools) {
  const model = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

  const executor = await initializeAgentExecutorWithOptions(availableTools, model, {
    agentType: "openai-functions",
    verbose: true,
    maxIterations: 5,
    returnIntermediateSteps: true,
    handleParsingErrors: (err) => \`Re-evaluating step. Error: \${err.message}\`
  });

  const result = await executor.call({ input: userGoal });
  return {
    output: result.output,
    executionTrace: result.intermediateSteps
  };
}`
  },
  {
    id: "cosmicquest",
    title: 'CosmicQuest: Space Exploration & E-Commerce',
    category: "Product Systems",
    tagline: 'Real-Time NASA Telemetry Integration Paired with a Modern E-Commerce Checkout Engine',
    description: 'An interactive scientific space exploration portal integrating official NASA Open APIs for live celestial data, astronomical imagery, and planetary tracking, combined with a full-stack merchandise e-commerce catalog featuring cart management and checkout state.',
    tech: ['MERN Stack', 'NASA APIs', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    href: 'https://github.com/BhavsarSamay/CosmicQuest',
    githubUrl: 'https://github.com/BhavsarSamay/CosmicQuest',
    metrics: 'Live NASA telemetry integration · E-commerce cart & checkout engine',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    problemStatement: 'Scientific space data is often siloed in academic portals with dated interfaces, lacking engaging interactivity and tangible community merchandise touchpoints.',
    architecture: 'NASA Open APIs -> Server Caching Layer -> Interactive React Visualizer -> E-Commerce Cart Engine -> Checkout Flow',
    pipelineStages: [
      { name: 'NASA API Ingestion', desc: 'Scheduled ETL workers fetching Astronomy Picture of the Day (APOD) and orbital telemetry' },
      { name: 'Caching & Rate Limiting', desc: 'Server-side caching layer buffering API responses to comply with NASA quota constraints' },
      { name: 'Interactive Visualizer', desc: 'Responsive React canvas/card components presenting orbital mechanics & planetary data' },
      { name: 'Commerce & Order Pipeline', desc: 'Atomic cart state management with persistent storage and checkout simulation' }
    ],
    challenges: [
      {
        title: 'NASA API Quota Protection',
        desc: 'Implemented smart in-memory and MongoDB caching to serve repetitive celestial queries without exhausting API limits.'
      },
      {
        title: 'Cart State Synchronization',
        desc: 'Synchronized local storage state with server sessions to prevent cart abandonment across navigation.'
      },
      {
        title: 'Media Optimization',
        desc: 'Handled high-resolution astronomical images with responsive srcset attributes and progressive blur-up placeholders.'
      }
    ],
    stats: [
      { value: '100% Live', label: 'NASA API Telemetry' },
      { value: '<80ms', label: 'Cached Query Latency' },
      { value: 'Full-Flow', label: 'Cart to Checkout' },
      { value: 'Responsive', label: 'Mobile & Desktop' }
    ],
    techStack: {
      frontend: ['React.js', 'Tailwind CSS', 'Framer Motion', 'Context API'],
      backend: ['Node.js', 'Express.js', 'REST APIs', 'Axios'],
      dataAI: ['NASA Open APIs', 'MongoDB', 'Mongoose'],
      infrastructure: ['Vercel', 'Render', 'Git']
    },
    highlights: [
      'Real-time orbital tracking and planetary data telemetry from official NASA APIs',
      'Complete merchandise e-commerce flow with cart management and checkout state',
      'Modern responsive UI built with Tailwind CSS and React component modularity'
    ],
    codeSnippet: `// CosmicQuest: NASA Telemetry Ingestion & Caching Layer
export const fetchCelestialTelemetry = async (req, res) => {
  const cacheKey = \`apod:\${req.query.date || 'today'}\`;
  const cachedData = await cacheService.get(cacheKey);

  if (cachedData) {
    return res.status(200).json({ source: 'cache', data: JSON.parse(cachedData) });
  }

  const nasaResponse = await axios.get(
    \`https://api.nasa.gov/planetary/apod?api_key=\${process.env.NASA_API_KEY}&date=\${req.query.date || ''}\`
  );

  await cacheService.setEx(cacheKey, 3600 * 12, JSON.stringify(nasaResponse.data));
  return res.status(200).json({ source: 'live', data: nasaResponse.data });
};`
  },
  {
    id: "echoing-ideas",
    title: 'Echoing Ideas: Publishing & Editorial Platform',
    category: "Full-Stack",
    tagline: 'High-Performance Publishing Platform with Django & FastAPI Backend Architecture',
    description: 'A modern publishing and blogging web platform combining rich editorial content authoring, user authentication, interactive comment trees, and lightning-fast query endpoints built across a React frontend and a dual Django / FastAPI service backend.',
    tech: ['React.js', 'Django', 'FastAPI', 'SQLite', 'PostgreSQL', 'Tailwind CSS', 'JWT'],
    href: 'https://github.com/BhavsarSamay/Echoing-Ideas',
    githubUrl: 'https://github.com/BhavsarSamay/Echoing-Ideas',
    metrics: 'Dual Django / FastAPI backend · Clean publishing workflow & markdown support',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    problemStatement: 'Writers and technical teams need a clean, distraction-free markdown publishing workflow that pairs comprehensive CMS administrative controls with sub-50ms article delivery.',
    architecture: 'React Frontend -> FastAPI High-Speed Endpoints / Django Admin CMS -> PostgreSQL -> JWT Security Layer',
    pipelineStages: [
      { name: 'Editorial Writing Studio', desc: 'Markdown-enabled drafting canvas with live syntax preview and asset uploads' },
      { name: 'FastAPI Read Pipeline', desc: 'Asynchronous Python endpoints delivering cached, serialized articles under high concurrency' },
      { name: 'Django Management Engine', desc: 'Robust ORM and administration portal managing author permissions and publishing status' },
      { name: 'Interactive Engagement', desc: 'Nested comment tree resolution with user authentication and activity metrics' }
    ],
    challenges: [
      {
        title: 'Dual-Backend Integration',
        desc: 'Leveraged Django for admin authentication and database migrations, alongside FastAPI for ultra-fast asynchronous article reads.'
      },
      {
        title: 'Nested Comments Resolution',
        desc: 'Optimized recursive query hierarchies in SQL to resolve deeply nested discussion threads in a single query pass.'
      },
      {
        title: 'Markdown Parsing Security',
        desc: 'Sanitized user-generated markdown to prevent XSS attacks while preserving syntax code formatting.'
      }
    ],
    stats: [
      { value: 'Dual-Engine', label: 'Django + FastAPI' },
      { value: '<45ms', label: 'Article Read Latency' },
      { value: 'Markdown', label: 'Authoring Studio' },
      { value: 'JWT', label: 'Role-Based Security' }
    ],
    techStack: {
      frontend: ['React.js', 'Tailwind CSS', 'React Router', 'Markdown Parser'],
      backend: ['FastAPI (Async)', 'Django REST Framework', 'Python 3.11'],
      dataAI: ['PostgreSQL', 'SQLite', 'SQLAlchemy / Django ORM'],
      infrastructure: ['Uvicorn / Gunicorn', 'JWT Auth', 'Git']
    },
    highlights: [
      'Clean editorial writing and publishing workflow with markdown support',
      'Interactive comment threads and user engagement metrics',
      'Fast API query resolution combining Django authentication with FastAPI endpoints'
    ],
    codeSnippet: `# Echoing Ideas: High-Speed FastAPI Article Delivery Endpoint
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Article
from .schemas import ArticleResponse

@app.get("/api/v1/articles/{slug}", response_model=ArticleResponse)
async def get_published_article(slug: str, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.slug == slug, Article.is_published == True).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found or not published")
    
    # Increment read counter asynchronously
    article.view_count += 1
    db.commit()
    return article`
  },
  {
    id: "bizcart",
    title: 'BizCart: Enterprise E-Commerce & Inventory Management',
    category: "Full-Stack",
    tagline: 'Multi-Category Product Catalog, Cart Engine & Real-Time Stock Management',
    description: 'A full-stack commerce web application engineered for scalable merchandise cataloging, dynamic category filtering, shopping cart state management, and administrative inventory controls.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Tailwind CSS'],
    href: 'https://github.com/BhavsarSamay/BizCart',
    githubUrl: 'https://github.com/BhavsarSamay/BizCart',
    metrics: 'Dynamic category filtering · Real-time stock alerts · Cart state management',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80',
    problemStatement: 'Retail businesses require responsive e-commerce interfaces that maintain instantaneous inventory sync, preventing overselling during traffic spikes.',
    architecture: 'React Client -> Express REST API -> MongoDB Atlas -> Stock Verification Engine -> Order Placement',
    pipelineStages: [
      { name: 'Product Catalog', desc: 'Multi-criteria faceted search and category filtering with responsive grid layouts' },
      { name: 'Cart State Manager', desc: 'Client-side cart store synchronized with inventory availability checks' },
      { name: 'Admin Inventory Desk', desc: 'Merchant dashboard for SKU creation, price overrides, and stock level warnings' }
    ],
    challenges: [
      {
        title: 'Race Condition Prevention',
        desc: 'Implemented atomic database operators in MongoDB to prevent concurrent checkouts of the last remaining item.'
      },
      {
        title: 'Optimistic UI Updates',
        desc: 'Delivered instant cart increment/decrement interactions with background rollback on network failures.'
      }
    ],
    stats: [
      { value: 'Atomic', label: 'Inventory Updates' },
      { value: 'Faceted', label: 'Product Filtering' },
      { value: 'End-to-End', label: 'Checkout Journey' }
    ],
    techStack: {
      frontend: ['React.js', 'HTML5/CSS3', 'Tailwind CSS', 'Lucide Icons'],
      backend: ['Node.js', 'Express.js', 'REST APIs'],
      dataAI: ['MongoDB', 'Mongoose ODM'],
      infrastructure: ['Git', 'Vercel / Render']
    },
    highlights: [
      'Multi-category product catalog with dynamic price, rating, and availability filters',
      'Resilient cart state management with persistent session synchronization',
      'Administrative inventory controls with low-stock warnings and SKU management'
    ],
    codeSnippet: `// BizCart: Atomic Inventory Decrement on Order Confirmation
export const processOrderCheckout = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const item of req.body.cartItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session, new: true }
      );
      if (!updated) throw new Error(\`Insufficient stock for item: \${item.name}\`);
    }
    const order = await Order.create([req.body.orderData], { session });
    await session.commitTransaction();
    res.status(201).json({ success: true, orderId: order[0]._id });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, error: err.message });
  } finally {
    session.endSession();
  }
};`
  },
  {
    id: "microservices",
    title: 'Distributed Microservices Architecture Engine',
    category: "Product Systems",
    tagline: 'Decoupled Service Mesh with API Gateway, Event Bus & Independent Scaling',
    description: 'A modular microservices backend architecture demonstrating decoupled service orchestration, centralized API gateway routing, asynchronous message bus eventing, and containerized deployment readiness.',
    tech: ['Node.js', 'Docker', 'REST APIs', 'Message Queue', 'Express.js', 'JavaScript'],
    href: 'https://github.com/BhavsarSamay/Microservices',
    githubUrl: 'https://github.com/BhavsarSamay/Microservices',
    metrics: 'Decoupled service mesh · API Gateway routing · Asynchronous event messaging',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    problemStatement: 'Monolithic enterprise backends become fragile bottlenecks as feature velocity increases, demanding service boundary isolation and fault tolerance.',
    architecture: 'Client Requests -> API Gateway (Reverse Proxy & Auth) -> Event Bus / Message Queue -> Microservice Clusters -> Dedicated DBs',
    pipelineStages: [
      { name: 'API Gateway Router', desc: 'Centralized ingress reverse-proxy routing requests to target microservices with rate limits' },
      { name: 'Asynchronous Event Bus', desc: 'Pub/sub message broker decoupling producer events from downstream consumer jobs' },
      { name: 'Service Isolation', desc: 'Independent domain services (User Auth, Catalog, Billing) with dedicated data boundaries' }
    ],
    challenges: [
      {
        title: 'Distributed Transaction Handling',
        desc: 'Implemented compensating transactions and saga patterns to ensure eventual data consistency across services.'
      },
      {
        title: 'Circuit Breaker Integration',
        desc: 'Added circuit breakers on service-to-service calls to isolate localized downtime and prevent cascading system outages.'
      }
    ],
    stats: [
      { value: 'Zero-Downtime', label: 'Independent Deployments' },
      { value: 'Event-Driven', label: 'Asynchronous Pub/Sub' },
      { value: 'Containerized', label: 'Docker Microservices' }
    ],
    techStack: {
      frontend: ['Gateway Health Dashboard'],
      backend: ['Node.js', 'Express.js', 'Reverse Proxy', 'Docker'],
      dataAI: ['PostgreSQL / MongoDB Micro-databases'],
      infrastructure: ['Docker Compose', 'Event Queue', 'Git']
    },
    highlights: [
      'Architected decoupled microservices with dedicated domain boundaries and data stores',
      'Configured centralized API Gateway handling routing, rate limiting, and unified logging',
      'Built asynchronous event messaging channels preventing cascading failures across service boundaries'
    ],
    codeSnippet: `// Microservices Gateway: Reverse Proxy & Resilient Routing
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const SERVICE_ROUTES = {
  "/api/auth": "http://auth-service:5001",
  "/api/orders": "http://orders-service:5002",
  "/api/inventory": "http://inventory-service:5003"
};

for (const [route, target] of Object.entries(SERVICE_ROUTES)) {
  app.use(route, createProxyMiddleware({
    target,
    changeOrigin: true,
    onError: (err, req, res) => {
      logger.error(\`Service unreachable: \${target} for \${route}\`);
      res.status(503).json({ error: "Service temporarily unavailable. Circuit open." });
    }
  }));
}`
  }
];

