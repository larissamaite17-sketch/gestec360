--
-- PostgreSQL database dump
--

\restrict fFkjYRAUtfdF37GO5d8gqHngmJKTweweaHF0BJ9ECmd1x0qOL4yqtdchWyaya8f

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-01 13:52:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 244 (class 1259 OID 16742)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id integer NOT NULL,
    empresa_id integer DEFAULT 1 NOT NULL,
    nome character varying(100) NOT NULL,
    ativo boolean DEFAULT true,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16741)
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_seq OWNER TO postgres;

--
-- TOC entry 5305 (class 0 OID 0)
-- Dependencies: 243
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- TOC entry 226 (class 1259 OID 16549)
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    empresa_id integer NOT NULL,
    nome character varying(150) NOT NULL,
    cpf character varying(20),
    telefone character varying(20),
    email character varying(150),
    endereco text,
    cidade character varying(100),
    estado character varying(2),
    cep character varying(10),
    ultima_compra date,
    quantidade_compras integer DEFAULT 0,
    total_gasto numeric(10,2) DEFAULT 0,
    ativo boolean DEFAULT true,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16548)
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_seq OWNER TO postgres;

--
-- TOC entry 5306 (class 0 OID 0)
-- Dependencies: 225
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- TOC entry 248 (class 1259 OID 16777)
-- Name: complementos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.complementos (
    id integer NOT NULL,
    empresa_id integer DEFAULT 1 NOT NULL,
    grupo_id integer,
    nome character varying(150) NOT NULL,
    preco numeric(10,2) DEFAULT 0,
    ativo boolean DEFAULT true,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.complementos OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16776)
-- Name: complementos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.complementos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.complementos_id_seq OWNER TO postgres;

--
-- TOC entry 5307 (class 0 OID 0)
-- Dependencies: 247
-- Name: complementos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.complementos_id_seq OWNED BY public.complementos.id;


--
-- TOC entry 240 (class 1259 OID 16706)
-- Name: configuracoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracoes (
    id integer NOT NULL,
    empresa_id integer,
    nome_empresa character varying(150),
    telefone character varying(30),
    email character varying(150),
    endereco text,
    cnpj character varying(30),
    logo text,
    rodape_comprovante text,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    razao_social character varying(200),
    whatsapp character varying(30)
);


ALTER TABLE public.configuracoes OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16705)
-- Name: configuracoes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuracoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuracoes_id_seq OWNER TO postgres;

--
-- TOC entry 5308 (class 0 OID 0)
-- Dependencies: 239
-- Name: configuracoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuracoes_id_seq OWNED BY public.configuracoes.id;


--
-- TOC entry 234 (class 1259 OID 16652)
-- Name: contas_pagar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contas_pagar (
    id integer NOT NULL,
    empresa_id integer NOT NULL,
    categoria character varying(100),
    descricao character varying(255) NOT NULL,
    valor numeric(10,2) NOT NULL,
    vencimento date,
    status character varying(20) DEFAULT 'Pendente'::character varying,
    data_pagamento date,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contas_pagar OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16651)
-- Name: contas_pagar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contas_pagar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contas_pagar_id_seq OWNER TO postgres;

--
-- TOC entry 5309 (class 0 OID 0)
-- Dependencies: 233
-- Name: contas_pagar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contas_pagar_id_seq OWNED BY public.contas_pagar.id;


--
-- TOC entry 232 (class 1259 OID 16629)
-- Name: contas_receber; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contas_receber (
    id integer NOT NULL,
    empresa_id integer NOT NULL,
    cliente_id integer,
    descricao character varying(255) NOT NULL,
    valor numeric(10,2) NOT NULL,
    vencimento date,
    status character varying(20) DEFAULT 'Pendente'::character varying,
    data_pagamento date,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contas_receber OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16628)
-- Name: contas_receber_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contas_receber_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contas_receber_id_seq OWNER TO postgres;

--
-- TOC entry 5310 (class 0 OID 0)
-- Dependencies: 231
-- Name: contas_receber_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contas_receber_id_seq OWNED BY public.contas_receber.id;


--
-- TOC entry 256 (class 1259 OID 16873)
-- Name: controle_pedidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.controle_pedidos (
    id integer NOT NULL,
    empresa_id integer NOT NULL,
    data_controle date NOT NULL,
    numero_atual integer DEFAULT 1
);


ALTER TABLE public.controle_pedidos OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 16872)
-- Name: controle_pedidos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.controle_pedidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.controle_pedidos_id_seq OWNER TO postgres;

--
-- TOC entry 5311 (class 0 OID 0)
-- Dependencies: 255
-- Name: controle_pedidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.controle_pedidos_id_seq OWNED BY public.controle_pedidos.id;


--
-- TOC entry 254 (class 1259 OID 16844)
-- Name: devolucoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devolucoes (
    id integer NOT NULL,
    empresa_id integer NOT NULL,
    venda_id integer,
    item_venda_id integer,
    quantidade numeric(10,3) NOT NULL,
    valor numeric(10,2) DEFAULT 0,
    motivo text,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    numero_pedido character varying(50),
    produto_id integer,
    produto_nome character varying(255),
    data_devolucao timestamp without time zone DEFAULT now()
);


ALTER TABLE public.devolucoes OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 16843)
-- Name: devolucoes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.devolucoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.devolucoes_id_seq OWNER TO postgres;

--
-- TOC entry 5312 (class 0 OID 0)
-- Dependencies: 253
-- Name: devolucoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.devolucoes_id_seq OWNED BY public.devolucoes.id;


--
-- TOC entry 220 (class 1259 OID 16483)
-- Name: empresas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresas (
    id integer NOT NULL,
    nome character varying(150) NOT NULL,
    responsavel character varying(150),
    telefone character varying(20),
    email character varying(150),
    login character varying(80) NOT NULL,
    senha character varying(255) NOT NULL,
    status character varying(20) DEFAULT 'Ativo'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.empresas OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16482)
-- Name: empresas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empresas_id_seq OWNER TO postgres;

--
-- TOC entry 5313 (class 0 OID 0)
-- Dependencies: 219
-- Name: empresas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresas_id_seq OWNED BY public.empresas.id;


--
-- TOC entry 236 (class 1259 OID 16670)
-- Name: fluxo_caixa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fluxo_caixa (
    id integer NOT NULL,
    empresa_id integer NOT NULL,
    tipo character varying(20) NOT NULL,
    descricao character varying(255),
    valor numeric(10,2) NOT NULL,
    data_movimento timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fluxo_caixa OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16669)
-- Name: fluxo_caixa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fluxo_caixa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fluxo_caixa_id_seq OWNER TO postgres;

--
-- TOC entry 5314 (class 0 OID 0)
-- Dependencies: 235
-- Name: fluxo_caixa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fluxo_caixa_id_seq OWNED BY public.fluxo_caixa.id;


--
-- TOC entry 238 (class 1259 OID 16687)
-- Name: funcionarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.funcionarios (
    id integer NOT NULL,
    empresa_id integer NOT NULL,
    nome character varying(150) NOT NULL,
    cargo character varying(100),
    login character varying(80),
    senha character varying(255),
    status character varying(20) DEFAULT 'Ativo'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.funcionarios OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16686)
-- Name: funcionarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.funcionarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.funcionarios_id_seq OWNER TO postgres;

--
-- TOC entry 5315 (class 0 OID 0)
-- Dependencies: 237
-- Name: funcionarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.funcionarios_id_seq OWNED BY public.funcionarios.id;


--
-- TOC entry 260 (class 1259 OID 16933)
-- Name: grupos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grupos (
    id integer NOT NULL,
    empresa_id integer DEFAULT 1,
    nome character varying(255) NOT NULL,
    ativo boolean DEFAULT true
);


ALTER TABLE public.grupos OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 16759)
-- Name: grupos_complementos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grupos_complementos (
    id integer NOT NULL,
    empresa_id integer DEFAULT 1 NOT NULL,
    nome character varying(100) NOT NULL,
    limite_padrao integer DEFAULT 0,
    ativo boolean DEFAULT true,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.grupos_complementos OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16758)
-- Name: grupos_complementos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grupos_complementos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grupos_complementos_id_seq OWNER TO postgres;

--
-- TOC entry 5316 (class 0 OID 0)
-- Dependencies: 245
-- Name: grupos_complementos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grupos_complementos_id_seq OWNED BY public.grupos_complementos.id;


--
-- TOC entry 259 (class 1259 OID 16932)
-- Name: grupos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grupos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grupos_id_seq OWNER TO postgres;

--
-- TOC entry 5317 (class 0 OID 0)
-- Dependencies: 259
-- Name: grupos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grupos_id_seq OWNED BY public.grupos.id;


--
-- TOC entry 252 (class 1259 OID 16821)
-- Name: item_venda_complementos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_venda_complementos (
    id integer NOT NULL,
    item_venda_id integer NOT NULL,
    complemento_id integer NOT NULL,
    quantidade numeric(10,2) DEFAULT 1,
    valor numeric(10,2) DEFAULT 0
);


ALTER TABLE public.item_venda_complementos OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16820)
-- Name: item_venda_complementos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_venda_complementos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_venda_complementos_id_seq OWNER TO postgres;

--
-- TOC entry 5318 (class 0 OID 0)
-- Dependencies: 251
-- Name: item_venda_complementos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_venda_complementos_id_seq OWNED BY public.item_venda_complementos.id;


--
-- TOC entry 230 (class 1259 OID 16603)
-- Name: itens_venda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.itens_venda (
    id integer NOT NULL,
    venda_id integer NOT NULL,
    produto_id integer NOT NULL,
    quantidade numeric(10,3) NOT NULL,
    valor_unitario numeric(10,2) NOT NULL,
    valor_total numeric(10,2) NOT NULL,
    observacao text,
    complementos jsonb,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.itens_venda OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16602)
-- Name: itens_venda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.itens_venda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.itens_venda_id_seq OWNER TO postgres;

--
-- TOC entry 5319 (class 0 OID 0)
-- Dependencies: 229
-- Name: itens_venda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.itens_venda_id_seq OWNED BY public.itens_venda.id;


--
-- TOC entry 242 (class 1259 OID 16725)
-- Name: marcas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marcas (
    id integer NOT NULL,
    empresa_id integer DEFAULT 1 NOT NULL,
    nome character varying(100) NOT NULL,
    ativo boolean DEFAULT true,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.marcas OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16724)
-- Name: marcas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marcas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marcas_id_seq OWNER TO postgres;

--
-- TOC entry 5320 (class 0 OID 0)
-- Dependencies: 241
-- Name: marcas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marcas_id_seq OWNED BY public.marcas.id;


--
-- TOC entry 250 (class 1259 OID 16800)
-- Name: produto_grupos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produto_grupos (
    id integer NOT NULL,
    produto_id integer NOT NULL,
    grupo_id integer NOT NULL,
    limite_escolhas integer DEFAULT 0
);


ALTER TABLE public.produto_grupos OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16799)
-- Name: produto_grupos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produto_grupos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produto_grupos_id_seq OWNER TO postgres;

--
-- TOC entry 5321 (class 0 OID 0)
-- Dependencies: 249
-- Name: produto_grupos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produto_grupos_id_seq OWNED BY public.produto_grupos.id;


--
-- TOC entry 224 (class 1259 OID 16525)
-- Name: produtos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produtos (
    id integer NOT NULL,
    empresa_id integer NOT NULL,
    identificacao character varying(50),
    codigo_barras character varying(50),
    nome character varying(150) NOT NULL,
    marca character varying(100),
    categoria character varying(100),
    unidade character varying(30),
    tipo_venda character varying(30),
    preco_custo numeric(10,2) DEFAULT 0,
    preco_venda numeric(10,2) DEFAULT 0,
    preco_kg numeric(10,2) DEFAULT 0,
    estoque numeric(10,3) DEFAULT 0,
    estoque_minimo numeric(10,3) DEFAULT 0,
    ativo boolean DEFAULT true,
    imagem text,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.produtos OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16524)
-- Name: produtos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produtos_id_seq OWNER TO postgres;

--
-- TOC entry 5322 (class 0 OID 0)
-- Dependencies: 223
-- Name: produtos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;


--
-- TOC entry 222 (class 1259 OID 16502)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    empresa_id integer,
    nome character varying(150) NOT NULL,
    login character varying(80) NOT NULL,
    senha character varying(255) NOT NULL,
    tipo character varying(20) DEFAULT 'cliente'::character varying,
    status character varying(20) DEFAULT 'Ativo'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email character varying(150)
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16501)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5323 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 258 (class 1259 OID 16913)
-- Name: venda_itens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.venda_itens (
    id integer NOT NULL,
    venda_id integer,
    produto_id integer,
    quantidade numeric(10,3),
    valor_unitario numeric(10,2),
    total numeric(10,2)
);


ALTER TABLE public.venda_itens OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 16912)
-- Name: venda_itens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.venda_itens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.venda_itens_id_seq OWNER TO postgres;

--
-- TOC entry 5324 (class 0 OID 0)
-- Dependencies: 257
-- Name: venda_itens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.venda_itens_id_seq OWNED BY public.venda_itens.id;


--
-- TOC entry 228 (class 1259 OID 16570)
-- Name: vendas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendas (
    id integer NOT NULL,
    empresa_id integer NOT NULL,
    cliente_id integer,
    numero_pedido integer NOT NULL,
    tipo_venda character varying(20) NOT NULL,
    forma_pagamento character varying(30) NOT NULL,
    status_pagamento character varying(20) DEFAULT 'Pago'::character varying,
    cpf_nota character varying(20),
    observacao text,
    subtotal numeric(10,2) DEFAULT 0,
    desconto numeric(10,2) DEFAULT 0,
    taxa_entrega numeric(10,2) DEFAULT 0,
    total numeric(10,2) NOT NULL,
    valor_recebido numeric(10,2) DEFAULT 0,
    troco numeric(10,2) DEFAULT 0,
    data_venda timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status_venda character varying(50) DEFAULT 'Concluída'::character varying
);


ALTER TABLE public.vendas OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16569)
-- Name: vendas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendas_id_seq OWNER TO postgres;

--
-- TOC entry 5325 (class 0 OID 0)
-- Dependencies: 227
-- Name: vendas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendas_id_seq OWNED BY public.vendas.id;


--
-- TOC entry 5004 (class 2604 OID 16745)
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- TOC entry 4971 (class 2604 OID 16552)
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- TOC entry 5013 (class 2604 OID 16780)
-- Name: complementos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complementos ALTER COLUMN id SET DEFAULT nextval('public.complementos_id_seq'::regclass);


--
-- TOC entry 4998 (class 2604 OID 16709)
-- Name: configuracoes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracoes ALTER COLUMN id SET DEFAULT nextval('public.configuracoes_id_seq'::regclass);


--
-- TOC entry 4990 (class 2604 OID 16655)
-- Name: contas_pagar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_pagar ALTER COLUMN id SET DEFAULT nextval('public.contas_pagar_id_seq'::regclass);


--
-- TOC entry 4987 (class 2604 OID 16632)
-- Name: contas_receber id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_receber ALTER COLUMN id SET DEFAULT nextval('public.contas_receber_id_seq'::regclass);


--
-- TOC entry 5027 (class 2604 OID 16876)
-- Name: controle_pedidos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.controle_pedidos ALTER COLUMN id SET DEFAULT nextval('public.controle_pedidos_id_seq'::regclass);


--
-- TOC entry 5023 (class 2604 OID 16847)
-- Name: devolucoes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devolucoes ALTER COLUMN id SET DEFAULT nextval('public.devolucoes_id_seq'::regclass);


--
-- TOC entry 4956 (class 2604 OID 16486)
-- Name: empresas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas ALTER COLUMN id SET DEFAULT nextval('public.empresas_id_seq'::regclass);


--
-- TOC entry 4993 (class 2604 OID 16673)
-- Name: fluxo_caixa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fluxo_caixa ALTER COLUMN id SET DEFAULT nextval('public.fluxo_caixa_id_seq'::regclass);


--
-- TOC entry 4995 (class 2604 OID 16690)
-- Name: funcionarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionarios ALTER COLUMN id SET DEFAULT nextval('public.funcionarios_id_seq'::regclass);


--
-- TOC entry 5030 (class 2604 OID 16936)
-- Name: grupos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupos ALTER COLUMN id SET DEFAULT nextval('public.grupos_id_seq'::regclass);


--
-- TOC entry 5008 (class 2604 OID 16762)
-- Name: grupos_complementos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupos_complementos ALTER COLUMN id SET DEFAULT nextval('public.grupos_complementos_id_seq'::regclass);


--
-- TOC entry 5020 (class 2604 OID 16824)
-- Name: item_venda_complementos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_venda_complementos ALTER COLUMN id SET DEFAULT nextval('public.item_venda_complementos_id_seq'::regclass);


--
-- TOC entry 4985 (class 2604 OID 16606)
-- Name: itens_venda id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda ALTER COLUMN id SET DEFAULT nextval('public.itens_venda_id_seq'::regclass);


--
-- TOC entry 5000 (class 2604 OID 16728)
-- Name: marcas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marcas ALTER COLUMN id SET DEFAULT nextval('public.marcas_id_seq'::regclass);


--
-- TOC entry 5018 (class 2604 OID 16803)
-- Name: produto_grupos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_grupos ALTER COLUMN id SET DEFAULT nextval('public.produto_grupos_id_seq'::regclass);


--
-- TOC entry 4963 (class 2604 OID 16528)
-- Name: produtos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);


--
-- TOC entry 4959 (class 2604 OID 16505)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 5029 (class 2604 OID 16916)
-- Name: venda_itens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda_itens ALTER COLUMN id SET DEFAULT nextval('public.venda_itens_id_seq'::regclass);


--
-- TOC entry 4976 (class 2604 OID 16573)
-- Name: vendas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendas ALTER COLUMN id SET DEFAULT nextval('public.vendas_id_seq'::regclass);


--
-- TOC entry 5283 (class 0 OID 16742)
-- Dependencies: 244
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id, empresa_id, nome, ativo, criado_em) FROM stdin;
1	1	teste	t	2026-06-29 16:53:49.306119
2	1	teste2	t	2026-06-29 17:10:14.768181
3	1	açai	t	2026-06-29 18:02:33.804142
4	1	sl	t	2026-06-29 18:03:19.487016
5	1	ddd	t	2026-06-29 19:21:14.2644
6	1	dw	t	2026-06-29 23:49:48.379881
7	1	qwe	t	2026-06-29 23:59:26.957579
8	1	4r	t	2026-06-30 11:41:25.84242
9	7	rr	t	2026-07-01 00:11:05.714239
10	6	teste	t	2026-07-01 01:01:32.352686
11	6	teste2	t	2026-07-01 01:08:24.811208
\.


--
-- TOC entry 5265 (class 0 OID 16549)
-- Dependencies: 226
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id, empresa_id, nome, cpf, telefone, email, endereco, cidade, estado, cep, ultima_compra, quantidade_compras, total_gasto, ativo, criado_em) FROM stdin;
2	1	larissa	\N	\N	\N	\N	\N	\N	\N	2026-06-30	1	5.50	t	2026-06-30 01:42:23.883054
4	1	larissa f	\N	\N	\N	\N	\N	\N	\N	2026-06-30	1	37.50	t	2026-06-30 01:49:15.559906
5	1	davi	\N	\N	\N	\N	\N	\N	\N	2026-06-30	1	15.54	t	2026-06-30 13:32:28.103833
3	1	teste	\N	\N	\N	\N	\N	\N	\N	2026-06-30	2	22.75	t	2026-06-30 01:44:57.933511
6	6	rr	\N	\N	\N	\N	\N	\N	\N	2026-07-01	1	16.98	t	2026-07-01 01:51:53.257007
7	6	teste	\N	\N	\N	\N	\N	\N	\N	2026-07-01	2	21.88	t	2026-07-01 08:47:49.999641
\.


--
-- TOC entry 5287 (class 0 OID 16777)
-- Dependencies: 248
-- Data for Name: complementos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.complementos (id, empresa_id, grupo_id, nome, preco, ativo, criado_em) FROM stdin;
1	1	1	teste	2.55	f	2026-06-29 22:52:32.069099
4	1	3	rrr	2.34	t	2026-06-30 11:42:18.063044
5	1	3	gggg	5.55	t	2026-06-30 11:49:53.958103
2	1	1	abce	2.40	t	2026-06-29 23:13:08.619198
6	1	1	rrr	3.33	t	2026-06-30 12:16:17.187776
7	6	13	teste1	8.50	t	2026-07-01 01:00:33.569743
8	6	12	dw	4.44	t	2026-07-01 01:50:48.445899
\.


--
-- TOC entry 5279 (class 0 OID 16706)
-- Dependencies: 240
-- Data for Name: configuracoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracoes (id, empresa_id, nome_empresa, telefone, email, endereco, cnpj, logo, rodape_comprovante, criado_em, razao_social, whatsapp) FROM stdin;
1	1	teste	(17) 99999-9999	larissa@gmail.com	{"cep":"15703082","rua":"Rua Apóstolo Paulo","numero":"1234","bairro":"Jardim América - Terceira Parte","cidade":"Jales","estado":"SP"}	12.345.678/9123-33	data:image/jpeg;base64,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	Obrigado pela preferência! Volte sempre.	2026-06-30 09:21:01.636619	teste	(99) 99999-9999
2	6	re	(33) 3	te	{"cep":"15703082","rua":"Rua Apóstolo Paulo","numero":"","bairro":"Jardim América - Terceira Parte","cidade":"Jales","estado":"SP"}	333.3		Obrigado pela preferência! Volte sempre.	2026-07-01 01:53:11.053575	re	(33) 33
\.


--
-- TOC entry 5273 (class 0 OID 16652)
-- Dependencies: 234
-- Data for Name: contas_pagar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contas_pagar (id, empresa_id, categoria, descricao, valor, vencimento, status, data_pagamento, criado_em) FROM stdin;
2	1	Energia	s	3.45	2029-05-25	Pendente	\N	2026-06-29 23:00:07.672561
1	1	Água	d	0.02	2027-02-10	Pago	2026-06-29	2026-06-29 22:42:56.915122
3	6	Água	teste	20.00	2026-07-01	Pendente	\N	2026-07-01 01:10:41.465443
4	6	Energia	12	15.00	2026-07-03	Pago	2026-07-01	2026-07-01 01:11:03.621999
\.


--
-- TOC entry 5271 (class 0 OID 16629)
-- Dependencies: 232
-- Data for Name: contas_receber; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contas_receber (id, empresa_id, cliente_id, descricao, valor, vencimento, status, data_pagamento, criado_em) FROM stdin;
2	1	\N	fef	25.00	2026-06-30	Pendente	\N	2026-06-29 23:29:45.287405
1	1	\N	dd	45.55	2028-05-02	Recebido	2026-06-29	2026-06-29 23:29:24.472943
4	6	\N	teste2	25.00	2026-08-03	Pendente	\N	2026-07-01 01:10:21.726555
3	6	\N	teste	20.00	2026-07-02	Recebido	2026-07-01	2026-07-01 01:10:02.182313
\.


--
-- TOC entry 5295 (class 0 OID 16873)
-- Dependencies: 256
-- Data for Name: controle_pedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.controle_pedidos (id, empresa_id, data_controle, numero_atual) FROM stdin;
\.


--
-- TOC entry 5293 (class 0 OID 16844)
-- Dependencies: 254
-- Data for Name: devolucoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devolucoes (id, empresa_id, venda_id, item_venda_id, quantidade, valor, motivo, criado_em, numero_pedido, produto_id, produto_nome, data_devolucao) FROM stdin;
1	1	6	\N	1.000	37.50	res	2026-06-30 13:34:49.694389	5	1	açaí 200 ml	2026-06-30 13:34:49.694389
2	1	5	\N	1.000	11.25	teste	2026-06-30 21:28:47.000675	4	1	açaí 200 ml	2026-06-30 21:28:47.000675
3	1	8	\N	1.000	15.00	k	2026-06-30 21:31:00.044039	1	1	açaí 200 ml	2026-06-30 21:31:00.044039
4	6	9	\N	1.000	12.98	des	2026-07-01 01:52:26.930844	2	15	ffee	2026-07-01 01:52:26.930844
\.


--
-- TOC entry 5259 (class 0 OID 16483)
-- Dependencies: 220
-- Data for Name: empresas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresas (id, nome, responsavel, telefone, email, login, senha, status, criado_em) FROM stdin;
1	Gestec360 Teste	Larissa			admin	$2b$10$5QmJY6D5XQY0c4gq6QmJ4.0Qw9vA2eYtKQ6d2iXqg5m1z9yVxR8tS	Ativo	2026-06-29 15:13:02.527053
2	lai	lai	2222222	lai@gmail.com	lai123	$2b$10$e8XoW8hafFh1tcI/ahN6FufG3iSZHX48641NybQs9GIgM8PO4bocC	Ativo	2026-06-30 16:39:55.113723
4	teste 2	teste 2	1111111	teste2@gmail.com	teste2	$2b$10$TZLQZ/TxuwLI.aemFn0Lm.cYbF1RDplCrqvdZOYGLjau126xebp/a	Ativo	2026-06-30 19:15:39.145529
5	vamos	la	1799854563	vamosla@gmail.com	vamosla	$2b$10$vQ1khWmY8Vb6KRMTVCYcX.XmRsDzACFXpFMI5Z0qExCq8wB3MS2Ka	Ativo	2026-06-30 21:55:10.24016
6	jesus	jesus	17992136301	jesus@gmail.com	jesus	$2b$10$qo1gkwHoYRu1F3clTS5WrehXWY.EgXSEseahU6rs8Zxvf8YanP3j2	Ativo	2026-06-30 22:50:56.339351
7	decert	decer	1234	decer@gmail.com	decer	$2b$10$ABe1ui7VeFjZBQq/n2N4r.uSjJLdwIXaQULr7M.7gjToqQKu9g0mq	Ativo	2026-07-01 00:09:30.255211
8	porfa	porfa	233	pro@gmail.com	porfa	$2b$10$LUGEoIbRmsj/V9LuelZ/YeRFFFNFFuFY831MnyktaakIZ5HpefFK6	Ativo	2026-07-01 00:55:27.636162
9	gdg	gdg	11111	gdg@gmail.com	gdg	$2b$10$ocQsWjO6XBlH3wcqS/FtfO2tRZkE87pAX.rgYYXITXp.rTRd8Rmgy	Ativo	2026-07-01 02:04:22.990855
3	AÇAI ROTA	ANA CLARA	17996457895	acairota@gestec.com.br	acairota	$2b$10$J4DOGBrd95JICJkPtoahmukoYCRhg4NQADSmcmSrg/9eqIKpEgJK2	Bloqueado	2026-06-30 18:09:07.161175
10	final	final	123456	final@gmail.com	final	$2b$10$jyGZd/ZE87.KRGw1DtOZB.QUZgT56m3XSbyb1qBE/j9aS3pr8.sFu	Ativo	2026-07-01 09:20:52.769993
\.


--
-- TOC entry 5275 (class 0 OID 16670)
-- Dependencies: 236
-- Data for Name: fluxo_caixa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fluxo_caixa (id, empresa_id, tipo, descricao, valor, data_movimento) FROM stdin;
1	1	Entrada	Venda #2	5.50	2026-06-29 21:57:43.680486
2	1	Saída	d	0.02	2026-06-29 23:00:19.141786
3	1	Entrada	dd	45.55	2026-06-29 23:30:04.268035
4	1	Entrada	Venda #3	5.50	2026-06-30 01:42:23.883054
5	1	Entrada	Venda #4	9.75	2026-06-30 01:44:57.933511
6	1	Entrada	Venda #5	37.50	2026-06-30 01:49:15.559906
7	1	Entrada	Venda #6	15.54	2026-06-30 13:32:28.103833
8	6	Entrada	teste	20.00	2026-07-01 01:10:24.87316
9	6	Saída	12	15.00	2026-07-01 01:16:26.732347
10	6	Saída	12	15.00	2026-07-01 01:16:25.079879
11	6	Saída	12	15.00	2026-07-01 01:16:25.079181
12	6	Entrada	Venda #3	6.44	2026-07-01 08:47:49.999641
13	6	Entrada	Venda #4	15.44	2026-07-01 09:11:48.845124
\.


--
-- TOC entry 5277 (class 0 OID 16687)
-- Dependencies: 238
-- Data for Name: funcionarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.funcionarios (id, empresa_id, nome, cargo, login, senha, status, criado_em) FROM stdin;
\.


--
-- TOC entry 5299 (class 0 OID 16933)
-- Dependencies: 260
-- Data for Name: grupos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grupos (id, empresa_id, nome, ativo) FROM stdin;
\.


--
-- TOC entry 5285 (class 0 OID 16759)
-- Dependencies: 246
-- Data for Name: grupos_complementos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grupos_complementos (id, empresa_id, nome, limite_padrao, ativo, criado_em) FROM stdin;
2	1	abc	0	f	2026-06-29 23:06:34.498173
3	1	asd	0	t	2026-06-30 00:00:53.050102
4	1	ted	0	f	2026-06-30 12:15:51.876035
1	1	teste1e	0	t	2026-06-29 22:39:33.973979
6	7	te	0	t	2026-07-01 00:17:44.373868
8	7	te	0	t	2026-07-01 00:17:44.38038
7	7	te	0	t	2026-07-01 00:17:44.139284
9	7	te	0	t	2026-07-01 00:17:45.220159
10	7	te	0	t	2026-07-01 00:17:45.275145
5	7	te	0	f	2026-07-01 00:17:44.627728
11	6	teste	0	f	2026-07-01 00:53:15.690132
12	6	teste	0	t	2026-07-01 00:53:23.296702
13	6	teste2	0	t	2026-07-01 01:00:20.500495
\.


--
-- TOC entry 5291 (class 0 OID 16821)
-- Dependencies: 252
-- Data for Name: item_venda_complementos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_venda_complementos (id, item_venda_id, complemento_id, quantidade, valor) FROM stdin;
\.


--
-- TOC entry 5269 (class 0 OID 16603)
-- Dependencies: 230
-- Data for Name: itens_venda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.itens_venda (id, venda_id, produto_id, quantidade, valor_unitario, valor_total, observacao, complementos, criado_em) FROM stdin;
\.


--
-- TOC entry 5281 (class 0 OID 16725)
-- Dependencies: 242
-- Data for Name: marcas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.marcas (id, empresa_id, nome, ativo, criado_em) FROM stdin;
1	1	teste	t	2026-06-29 16:53:42.939493
2	1	teste	t	2026-06-29 16:53:42.993102
3	1	teste2	t	2026-06-29 17:10:05.128552
4	1	açai lari	t	2026-06-29 18:02:28.650415
5	1	sl	t	2026-06-29 18:03:07.525992
6	1	sa	t	2026-06-29 19:21:07.222241
9	1	sa	t	2026-06-29 19:21:07.77373
8	1	sa	t	2026-06-29 19:21:07.515056
7	1	sa	t	2026-06-29 19:21:06.403852
10	1	sa	t	2026-06-29 19:21:08.055596
11	1	sa	t	2026-06-29 19:21:08.832479
12	1	sa	t	2026-06-29 19:21:08.863724
13	1	sa	t	2026-06-29 19:21:08.99385
14	1	sa	t	2026-06-29 19:21:09.02913
15	1	sa	t	2026-06-29 19:21:09.35226
16	1	tese	t	2026-06-29 19:21:18.836952
17	1	qwe	t	2026-06-29 23:59:22.696034
21	1	abcde	t	2026-06-30 01:53:40.043604
22	1	er	t	2026-06-30 11:41:17.98044
23	7	rr	t	2026-07-01 00:11:01.541168
24	6	teste	t	2026-07-01 01:01:26.684949
25	6	teste	t	2026-07-01 01:08:10.999039
26	6	teste	t	2026-07-01 01:08:15.031623
27	6	teste	t	2026-07-01 01:08:15.23886
28	6	teste	t	2026-07-01 01:08:16.489693
\.


--
-- TOC entry 5289 (class 0 OID 16800)
-- Dependencies: 250
-- Data for Name: produto_grupos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produto_grupos (id, produto_id, grupo_id, limite_escolhas) FROM stdin;
\.


--
-- TOC entry 5263 (class 0 OID 16525)
-- Dependencies: 224
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produtos (id, empresa_id, identificacao, codigo_barras, nome, marca, categoria, unidade, tipo_venda, preco_custo, preco_venda, preco_kg, estoque, estoque_minimo, ativo, imagem, criado_em) FROM stdin;
4	1	4		esse	teste2	sl	UNIDADE	UNIDADE	5.00	12.00	\N	2.000	-1.000	t	\N	2026-06-29 19:23:46.030776
5	1	5		teste	teste	ddd	UNIDADE	UNIDADE	0.04	0.04	\N	4.000	3.000	t	\N	2026-06-29 22:53:23.902664
6	1	6	123	qwe	qwe	qwe	UNIDADE	UNIDADE	2.22	3.33	\N	2.000	1.000	t	\N	2026-06-29 23:59:47.688262
7	1	7		rr	er	4r	UNIDADE	UNIDADE	4.44	4.44	\N	2.000	2.000	t	\N	2026-06-30 11:42:00.282038
3	1	3		as	tese	ddd	KG	PESO	50.00	70.00	70.00	21.000	10.000	t	\N	2026-06-29 19:21:35.828057
8	1	8		teste	teste	ddd	UNIDADE	UNIDADE	44.44	444.44	\N	4.000	4.000	t	\N	2026-06-30 20:55:51.073329
1	1	1	123	açaí 200 ml	açai lari	açai	KG	PESO	55.00	75.00	75.00	-5.000	1.000	t	\N	2026-06-29 18:02:58.172613
9	7	1		4	rr	rr	UNIDADE	UNIDADE	0.04	0.04	\N	0.000	0.000	t	\N	2026-07-01 00:11:19.358776
13	6	3		kef	teste	teste2	UNIDADE	UNIDADE	2.50	2.50	\N	2.000	1.000	t	\N	2026-07-01 01:38:39.858635
14	6	4		22			UNIDADE	UNIDADE	0.02	0.02	\N	2.000	2.000	t	\N	2026-07-01 01:47:32.557268
15	6	5		ffee			UNIDADE	UNIDADE	0.04	0.04	\N	0.000	1.000	t	\N	2026-07-01 01:51:22.156153
11	6	1	123	teste	teste	teste	UNIDADE	UNIDADE	1.00	2.00	\N	9.000	5.000	t	\N	2026-07-01 01:09:34.759781
12	6	2		tete	teste	teste2	KG	PESO	20.00	50.00	50.00	1.000	1.000	t	\N	2026-07-01 01:18:29.585017
\.


--
-- TOC entry 5261 (class 0 OID 16502)
-- Dependencies: 222
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, empresa_id, nome, login, senha, tipo, status, criado_em, email) FROM stdin;
1	1	teste	teste@gmail.com	$2b$10$rrngUfO1sVCx7Omt3jD4K.okVmaoDggLDsrfeuuUEyGXeuKkPLLQG	Caixa	Ativo	2026-06-30 10:26:00.038505	teste@gmail.com
3	2	lai	lai123	$2b$10$e8XoW8hafFh1tcI/ahN6FufG3iSZHX48641NybQs9GIgM8PO4bocC	Administrador	Ativo	2026-06-30 16:39:55.378052	lai@gmail.com
4	3	ANA CLARA	acairota	$2b$10$J4DOGBrd95JICJkPtoahmukoYCRhg4NQADSmcmSrg/9eqIKpEgJK2	Administrador	Ativo	2026-06-30 18:09:07.202301	acairota@gestec.com.br
5	4	teste 2	teste2	$2b$10$TZLQZ/TxuwLI.aemFn0Lm.cYbF1RDplCrqvdZOYGLjau126xebp/a	Administrador	Ativo	2026-06-30 19:15:39.202221	teste2@gmail.com
6	5	la	vamosla	$2b$10$vQ1khWmY8Vb6KRMTVCYcX.XmRsDzACFXpFMI5Z0qExCq8wB3MS2Ka	Administrador	Ativo	2026-06-30 21:55:10.325165	vamosla@gmail.com
7	6	jesus	jesus	$2b$10$qo1gkwHoYRu1F3clTS5WrehXWY.EgXSEseahU6rs8Zxvf8YanP3j2	Administrador	Ativo	2026-06-30 22:50:56.371071	jesus@gmail.com
2	1	teste 2	teste2@hotmail.com	$2b$10$YNECBzlRtkDyDV2R2Uk0Z.00ZEqZItwBmok/.pcddWfg9IhvN8ovq	Gerente	Ativo	2026-06-30 10:27:09.755571	teste2@hotmail.com
8	7	decer	decer	$2b$10$ABe1ui7VeFjZBQq/n2N4r.uSjJLdwIXaQULr7M.7gjToqQKu9g0mq	Administrador	Ativo	2026-07-01 00:09:30.307992	decer@gmail.com
9	8	porfa	porfa	$2b$10$LUGEoIbRmsj/V9LuelZ/YeRFFFNFFuFY831MnyktaakIZ5HpefFK6	Administrador	Ativo	2026-07-01 00:55:27.669613	pro@gmail.com
10	6	teste	teste123@gmail.com	$2b$10$3HEHflRXjOpJPNiV2cpEdO/6ZNApBkIHptCNtSLFkQ1VHnUhQymYm	Caixa	Ativo	2026-07-01 01:53:33.340412	teste123@gmail.com
11	9	gdg	gdg	$2b$10$ocQsWjO6XBlH3wcqS/FtfO2tRZkE87pAX.rgYYXITXp.rTRd8Rmgy	Administrador	Ativo	2026-07-01 02:04:23.029224	gdg@gmail.com
12	10	final	final	$2b$10$jyGZd/ZE87.KRGw1DtOZB.QUZgT56m3XSbyb1qBE/j9aS3pr8.sFu	Administrador	Ativo	2026-07-01 09:20:52.789868	final@gmail.com
\.


--
-- TOC entry 5297 (class 0 OID 16913)
-- Dependencies: 258
-- Data for Name: venda_itens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.venda_itens (id, venda_id, produto_id, quantidade, valor_unitario, total) FROM stdin;
1	1	1	1.000	15.00	15.00
2	2	1	1.000	75.00	75.00
3	3	1	1.000	7.50	7.50
4	4	1	1.000	7.50	7.50
5	5	1	1.000	11.25	11.25
6	6	1	1.000	37.50	37.50
7	7	3	1.000	15.54	15.54
8	8	1	1.000	15.00	15.00
9	9	15	1.000	12.98	12.98
10	10	11	1.000	6.44	6.44
11	11	12	1.000	16.94	16.94
\.


--
-- TOC entry 5267 (class 0 OID 16570)
-- Dependencies: 228
-- Data for Name: vendas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendas (id, empresa_id, cliente_id, numero_pedido, tipo_venda, forma_pagamento, status_pagamento, cpf_nota, observacao, subtotal, desconto, taxa_entrega, total, valor_recebido, troco, data_venda, status_venda) FROM stdin;
1	1	\N	2	Balcão	Dinheiro	Pago		teste	15.00	1.00	0.00	14.00	20.00	6.00	2026-06-29 20:55:11.418273	Concluída
2	1	\N	1	Entrega	Pix	Pendente		er	75.00	2.00	3.00	76.00	0.00	0.00	2026-06-29 21:05:29.314459	Concluída
3	1	\N	2	Balcão	Débito	Pago	554.444.444-44	teste	7.50	2.00	0.00	5.50	0.00	0.00	2026-06-29 21:57:43.680486	Concluída
4	1	2	3	Balcão	Pix	Pago			7.50	2.00	0.00	5.50	0.00	0.00	2026-06-30 01:42:23.883054	Concluída
7	1	5	6	Balcão	Pix	Pago			15.54	0.00	0.00	15.54	0.00	0.00	2026-06-30 13:32:28.103833	Concluída
6	1	4	5	Balcão	Dinheiro	Pago			37.50	0.00	0.00	37.50	40.00	2.50	2026-06-30 01:49:15.559906	Devolvida
5	1	3	4	Retirada	Dinheiro	Pago			11.25	1.50	0.00	9.75	50.00	40.25	2026-06-30 01:44:57.933511	Devolvida
8	1	3	1	Entrega	Pix	Pendente			15.00	2.00	0.00	13.00	0.00	0.00	2026-06-30 21:14:27.821945	Devolvida
9	6	6	2	Entrega	Pix	Pendente			12.98	1.00	5.00	16.98	0.00	0.00	2026-07-01 01:51:53.257007	Devolvida
10	6	7	3	Balcão	Dinheiro	Pago			6.44	0.00	0.00	6.44	10.00	3.56	2026-07-01 08:47:49.999641	Concluída
11	6	7	4	Balcão	Dinheiro	Pago			16.94	1.50	0.00	15.44	20.00	4.56	2026-07-01 09:11:48.845124	Concluída
\.


--
-- TOC entry 5326 (class 0 OID 0)
-- Dependencies: 243
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_seq', 11, true);


--
-- TOC entry 5327 (class 0 OID 0)
-- Dependencies: 225
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_seq', 7, true);


--
-- TOC entry 5328 (class 0 OID 0)
-- Dependencies: 247
-- Name: complementos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.complementos_id_seq', 8, true);


--
-- TOC entry 5329 (class 0 OID 0)
-- Dependencies: 239
-- Name: configuracoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracoes_id_seq', 2, true);


--
-- TOC entry 5330 (class 0 OID 0)
-- Dependencies: 233
-- Name: contas_pagar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contas_pagar_id_seq', 4, true);


--
-- TOC entry 5331 (class 0 OID 0)
-- Dependencies: 231
-- Name: contas_receber_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contas_receber_id_seq', 4, true);


--
-- TOC entry 5332 (class 0 OID 0)
-- Dependencies: 255
-- Name: controle_pedidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.controle_pedidos_id_seq', 1, false);


--
-- TOC entry 5333 (class 0 OID 0)
-- Dependencies: 253
-- Name: devolucoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.devolucoes_id_seq', 4, true);


--
-- TOC entry 5334 (class 0 OID 0)
-- Dependencies: 219
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresas_id_seq', 10, true);


--
-- TOC entry 5335 (class 0 OID 0)
-- Dependencies: 235
-- Name: fluxo_caixa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fluxo_caixa_id_seq', 13, true);


--
-- TOC entry 5336 (class 0 OID 0)
-- Dependencies: 237
-- Name: funcionarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.funcionarios_id_seq', 1, false);


--
-- TOC entry 5337 (class 0 OID 0)
-- Dependencies: 245
-- Name: grupos_complementos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grupos_complementos_id_seq', 13, true);


--
-- TOC entry 5338 (class 0 OID 0)
-- Dependencies: 259
-- Name: grupos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grupos_id_seq', 1, false);


--
-- TOC entry 5339 (class 0 OID 0)
-- Dependencies: 251
-- Name: item_venda_complementos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_venda_complementos_id_seq', 1, false);


--
-- TOC entry 5340 (class 0 OID 0)
-- Dependencies: 229
-- Name: itens_venda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.itens_venda_id_seq', 1, false);


--
-- TOC entry 5341 (class 0 OID 0)
-- Dependencies: 241
-- Name: marcas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.marcas_id_seq', 28, true);


--
-- TOC entry 5342 (class 0 OID 0)
-- Dependencies: 249
-- Name: produto_grupos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produto_grupos_id_seq', 1, false);


--
-- TOC entry 5343 (class 0 OID 0)
-- Dependencies: 223
-- Name: produtos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produtos_id_seq', 15, true);


--
-- TOC entry 5344 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 12, true);


--
-- TOC entry 5345 (class 0 OID 0)
-- Dependencies: 257
-- Name: venda_itens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.venda_itens_id_seq', 11, true);


--
-- TOC entry 5346 (class 0 OID 0)
-- Dependencies: 227
-- Name: vendas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendas_id_seq', 11, true);


--
-- TOC entry 5064 (class 2606 OID 16752)
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- TOC entry 5044 (class 2606 OID 16563)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- TOC entry 5068 (class 2606 OID 16788)
-- Name: complementos complementos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complementos
    ADD CONSTRAINT complementos_pkey PRIMARY KEY (id);


--
-- TOC entry 5058 (class 2606 OID 16717)
-- Name: configuracoes configuracoes_empresa_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracoes
    ADD CONSTRAINT configuracoes_empresa_id_key UNIQUE (empresa_id);


--
-- TOC entry 5060 (class 2606 OID 16715)
-- Name: configuracoes configuracoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracoes
    ADD CONSTRAINT configuracoes_pkey PRIMARY KEY (id);


--
-- TOC entry 5052 (class 2606 OID 16663)
-- Name: contas_pagar contas_pagar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT contas_pagar_pkey PRIMARY KEY (id);


--
-- TOC entry 5050 (class 2606 OID 16640)
-- Name: contas_receber contas_receber_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_receber
    ADD CONSTRAINT contas_receber_pkey PRIMARY KEY (id);


--
-- TOC entry 5076 (class 2606 OID 16884)
-- Name: controle_pedidos controle_pedidos_empresa_id_data_controle_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.controle_pedidos
    ADD CONSTRAINT controle_pedidos_empresa_id_data_controle_key UNIQUE (empresa_id, data_controle);


--
-- TOC entry 5078 (class 2606 OID 16882)
-- Name: controle_pedidos controle_pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.controle_pedidos
    ADD CONSTRAINT controle_pedidos_pkey PRIMARY KEY (id);


--
-- TOC entry 5074 (class 2606 OID 16856)
-- Name: devolucoes devolucoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devolucoes
    ADD CONSTRAINT devolucoes_pkey PRIMARY KEY (id);


--
-- TOC entry 5034 (class 2606 OID 16499)
-- Name: empresas empresas_login_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_login_key UNIQUE (login);


--
-- TOC entry 5036 (class 2606 OID 16497)
-- Name: empresas empresas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_pkey PRIMARY KEY (id);


--
-- TOC entry 5054 (class 2606 OID 16680)
-- Name: fluxo_caixa fluxo_caixa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fluxo_caixa
    ADD CONSTRAINT fluxo_caixa_pkey PRIMARY KEY (id);


--
-- TOC entry 5056 (class 2606 OID 16699)
-- Name: funcionarios funcionarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_pkey PRIMARY KEY (id);


--
-- TOC entry 5066 (class 2606 OID 16770)
-- Name: grupos_complementos grupos_complementos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupos_complementos
    ADD CONSTRAINT grupos_complementos_pkey PRIMARY KEY (id);


--
-- TOC entry 5082 (class 2606 OID 16942)
-- Name: grupos grupos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupos
    ADD CONSTRAINT grupos_pkey PRIMARY KEY (id);


--
-- TOC entry 5072 (class 2606 OID 16831)
-- Name: item_venda_complementos item_venda_complementos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_venda_complementos
    ADD CONSTRAINT item_venda_complementos_pkey PRIMARY KEY (id);


--
-- TOC entry 5048 (class 2606 OID 16617)
-- Name: itens_venda itens_venda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda
    ADD CONSTRAINT itens_venda_pkey PRIMARY KEY (id);


--
-- TOC entry 5062 (class 2606 OID 16735)
-- Name: marcas marcas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT marcas_pkey PRIMARY KEY (id);


--
-- TOC entry 5070 (class 2606 OID 16809)
-- Name: produto_grupos produto_grupos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_grupos
    ADD CONSTRAINT produto_grupos_pkey PRIMARY KEY (id);


--
-- TOC entry 5042 (class 2606 OID 16542)
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


--
-- TOC entry 5038 (class 2606 OID 16518)
-- Name: usuarios usuarios_login_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_login_key UNIQUE (login);


--
-- TOC entry 5040 (class 2606 OID 16516)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 5080 (class 2606 OID 16919)
-- Name: venda_itens venda_itens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda_itens
    ADD CONSTRAINT venda_itens_pkey PRIMARY KEY (id);


--
-- TOC entry 5046 (class 2606 OID 16590)
-- Name: vendas vendas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_pkey PRIMARY KEY (id);


--
-- TOC entry 5097 (class 2606 OID 16753)
-- Name: categorias categorias_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5085 (class 2606 OID 16564)
-- Name: clientes clientes_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5099 (class 2606 OID 16789)
-- Name: complementos complementos_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complementos
    ADD CONSTRAINT complementos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5100 (class 2606 OID 16794)
-- Name: complementos complementos_grupo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complementos
    ADD CONSTRAINT complementos_grupo_id_fkey FOREIGN KEY (grupo_id) REFERENCES public.grupos_complementos(id) ON DELETE CASCADE;


--
-- TOC entry 5095 (class 2606 OID 16719)
-- Name: configuracoes configuracoes_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracoes
    ADD CONSTRAINT configuracoes_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5092 (class 2606 OID 16664)
-- Name: contas_pagar contas_pagar_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT contas_pagar_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5090 (class 2606 OID 16646)
-- Name: contas_receber contas_receber_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_receber
    ADD CONSTRAINT contas_receber_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);


--
-- TOC entry 5091 (class 2606 OID 16641)
-- Name: contas_receber contas_receber_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_receber
    ADD CONSTRAINT contas_receber_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5108 (class 2606 OID 16885)
-- Name: controle_pedidos controle_pedidos_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.controle_pedidos
    ADD CONSTRAINT controle_pedidos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5105 (class 2606 OID 16857)
-- Name: devolucoes devolucoes_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devolucoes
    ADD CONSTRAINT devolucoes_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5106 (class 2606 OID 16867)
-- Name: devolucoes devolucoes_item_venda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devolucoes
    ADD CONSTRAINT devolucoes_item_venda_id_fkey FOREIGN KEY (item_venda_id) REFERENCES public.itens_venda(id);


--
-- TOC entry 5107 (class 2606 OID 16862)
-- Name: devolucoes devolucoes_venda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devolucoes
    ADD CONSTRAINT devolucoes_venda_id_fkey FOREIGN KEY (venda_id) REFERENCES public.vendas(id) ON DELETE CASCADE;


--
-- TOC entry 5093 (class 2606 OID 16681)
-- Name: fluxo_caixa fluxo_caixa_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fluxo_caixa
    ADD CONSTRAINT fluxo_caixa_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5094 (class 2606 OID 16700)
-- Name: funcionarios funcionarios_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5098 (class 2606 OID 16771)
-- Name: grupos_complementos grupos_complementos_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupos_complementos
    ADD CONSTRAINT grupos_complementos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5103 (class 2606 OID 16837)
-- Name: item_venda_complementos item_venda_complementos_complemento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_venda_complementos
    ADD CONSTRAINT item_venda_complementos_complemento_id_fkey FOREIGN KEY (complemento_id) REFERENCES public.complementos(id);


--
-- TOC entry 5104 (class 2606 OID 16832)
-- Name: item_venda_complementos item_venda_complementos_item_venda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_venda_complementos
    ADD CONSTRAINT item_venda_complementos_item_venda_id_fkey FOREIGN KEY (item_venda_id) REFERENCES public.itens_venda(id) ON DELETE CASCADE;


--
-- TOC entry 5088 (class 2606 OID 16623)
-- Name: itens_venda itens_venda_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda
    ADD CONSTRAINT itens_venda_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id);


--
-- TOC entry 5089 (class 2606 OID 16618)
-- Name: itens_venda itens_venda_venda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda
    ADD CONSTRAINT itens_venda_venda_id_fkey FOREIGN KEY (venda_id) REFERENCES public.vendas(id) ON DELETE CASCADE;


--
-- TOC entry 5096 (class 2606 OID 16736)
-- Name: marcas marcas_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT marcas_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5101 (class 2606 OID 16815)
-- Name: produto_grupos produto_grupos_grupo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_grupos
    ADD CONSTRAINT produto_grupos_grupo_id_fkey FOREIGN KEY (grupo_id) REFERENCES public.grupos_complementos(id) ON DELETE CASCADE;


--
-- TOC entry 5102 (class 2606 OID 16810)
-- Name: produto_grupos produto_grupos_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_grupos
    ADD CONSTRAINT produto_grupos_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE CASCADE;


--
-- TOC entry 5084 (class 2606 OID 16543)
-- Name: produtos produtos_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5083 (class 2606 OID 16519)
-- Name: usuarios usuarios_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- TOC entry 5109 (class 2606 OID 16925)
-- Name: venda_itens venda_itens_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda_itens
    ADD CONSTRAINT venda_itens_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id);


--
-- TOC entry 5110 (class 2606 OID 16920)
-- Name: venda_itens venda_itens_venda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda_itens
    ADD CONSTRAINT venda_itens_venda_id_fkey FOREIGN KEY (venda_id) REFERENCES public.vendas(id) ON DELETE CASCADE;


--
-- TOC entry 5086 (class 2606 OID 16596)
-- Name: vendas vendas_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);


--
-- TOC entry 5087 (class 2606 OID 16591)
-- Name: vendas vendas_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


-- Completed on 2026-07-01 13:52:44

--
-- PostgreSQL database dump complete
--

\unrestrict fFkjYRAUtfdF37GO5d8gqHngmJKTweweaHF0BJ9ECmd1x0qOL4yqtdchWyaya8f

