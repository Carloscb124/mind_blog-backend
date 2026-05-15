-- ============================================
-- Mind Blog - Dump do Banco de Dados
-- ============================================

CREATE DATABASE IF NOT EXISTS mind_blog
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mind_blog;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de artigos
CREATE TABLE IF NOT EXISTS articles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  banner_url VARCHAR(500) DEFAULT NULL,
  author_id INT UNSIGNED NOT NULL,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_articles_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dados de exemplo: usuário admin
-- Senha: admin123 (hash bcrypt)
INSERT INTO users (name, email, password) VALUES
(
  'Admin Mind',
  'admin@mindblog.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);

-- Artigos de exemplo
INSERT INTO articles (title, content, banner_url, author_id) VALUES
(
  'Desvendando o JavaScript: Dicas e Técnicas Essenciais para Desenvolvedores',
  'JavaScript é uma das linguagens de programação mais utilizadas no mundo. Neste artigo, exploramos as técnicas mais modernas e essenciais para desenvolvedores que desejam aprimorar suas habilidades.\n\nCom o ES2022 e além, temos acesso a recursos como top-level await, class fields, e muito mais. Dominar essas funcionalidades é fundamental para escrever código limpo e eficiente.\n\nAlém disso, entender o event loop, closures e o prototype chain são conhecimentos que diferenciam um desenvolvedor júnior de um sênior.',
  NULL,
  1
),
(
  'Inteligência Artificial: O Futuro da Automação e da Transformação Digital',
  'A Inteligência Artificial está moldando o futuro dos negócios e da tecnologia. Neste artigo, exploramos como a IA está transformando diferentes setores da economia.\n\nDe chatbots a modelos de linguagem avançados, as possibilidades são imensas. Empresas que adotam IA cedo saem na frente da concorrência e conseguem automatizar processos repetitivos.\n\nO importante é entender que a IA não substitui humanos, mas os augmenta — tornando profissionais mais produtivos e capazes.',
  NULL,
  1
),
(
  'Computação Quântica: O Próximo Grande Salto para a Tecnologia',
  'A computação quântica representa uma revolução no modo como processamos informações. Enquanto computadores clássicos usam bits (0 ou 1), computadores quânticos usam qubits, que podem existir em superposição.\n\nIsso permite resolver problemas complexos de criptografia, otimização e simulação molecular em frações do tempo que levaria em máquinas tradicionais.\n\nAinda estamos nos estágios iniciais, mas empresas como IBM, Google e startups ao redor do mundo já estão investindo bilhões nessa tecnologia.',
  NULL,
  1
);
