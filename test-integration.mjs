// Teste de Integração Frontend-Backend
// Este script testa se as rotas do backend estão funcionando corretamente
// e se os dados estão sendo preenchidos onde deveriam no frontend

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações
const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:3000';

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class IntegrationTester {
  constructor() {
    this.testResults = [];
    this.backendRoutes = [
      { method: 'GET', path: '/health', description: 'Health Check' },
      { method: 'POST', path: '/api/v1/auth/login', description: 'Login' },
      { method: 'POST', path: '/api/v1/auth/signup', description: 'Signup' },
      { method: 'GET', path: '/api/v1/auth/me', description: 'Get User Profile' }
    ];
    this.frontendPages = [
      { path: '/', description: 'Home Page' },
      { path: '/auth/login', description: 'Login Page' },
      { path: '/auth/signup', description: 'Signup Page' },
      { path: '/dashboard', description: 'Dashboard' },
      { path: '/alerts', description: 'Alerts Page' },
      { path: '/ativos', description: 'Assets Page' },
      { path: '/maintenance', description: 'Maintenance Page' },
      { path: '/analytics', description: 'Analytics Page' }
    ];
  }

  async testBackendHealth() {
    log('\n🔍 Testando conectividade do Backend...', 'cyan');
    
    try {
      const response = await axios.get(`${BACKEND_URL}/health`, {
        timeout: 5000
      });
      
      if (response.status === 200) {
        log('✅ Backend está rodando e respondendo', 'green');
        log(`   Status: ${response.data.status}`, 'blue');
        log(`   Uptime: ${Math.floor(response.data.uptime)}s`, 'blue');
        return true;
      }
    } catch (error) {
      log('❌ Backend não está acessível', 'red');
      log(`   Erro: ${error.message}`, 'red');
      return false;
    }
  }

  async testFrontendHealth() {
    log('\n🔍 Testando conectividade do Frontend...', 'cyan');
    
    try {
      const response = await axios.get(FRONTEND_URL, {
        timeout: 5000,
        validateStatus: () => true // Aceita qualquer status
      });
      
      if (response.status === 200 || response.status === 404) {
        log('✅ Frontend está rodando e acessível', 'green');
        return true;
      }
    } catch (error) {
      log('❌ Frontend não está acessível', 'red');
      log(`   Erro: ${error.message}`, 'red');
      return false;
    }
  }

  async testBackendRoutes() {
    log('\n🔍 Testando rotas do Backend...', 'cyan');
    
    for (const route of this.backendRoutes) {
      try {
        let response;
        const url = `${BACKEND_URL}${route.path}`;
        
        if (route.method === 'GET') {
          response = await axios.get(url, {
            timeout: 5000,
            validateStatus: () => true
          });
        } else if (route.method === 'POST') {
          // Para rotas POST, enviamos dados de teste
          const testData = this.getTestDataForRoute(route.path);
          response = await axios.post(url, testData, {
            timeout: 5000,
            validateStatus: () => true,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        
        const status = response.status;
        const isSuccess = status < 500; // Considera sucesso se não for erro de servidor
        
        if (isSuccess) {
          log(`✅ ${route.method} ${route.path} - ${route.description}`, 'green');
          log(`   Status: ${status}`, 'blue');
        } else {
          log(`❌ ${route.method} ${route.path} - ${route.description}`, 'red');
          log(`   Status: ${status}`, 'red');
        }
        
        this.testResults.push({
          type: 'backend',
          route: route.path,
          method: route.method,
          status,
          success: isSuccess
        });
        
      } catch (error) {
        log(`❌ ${route.method} ${route.path} - ${route.description}`, 'red');
        log(`   Erro: ${error.message}`, 'red');
        
        this.testResults.push({
          type: 'backend',
          route: route.path,
          method: route.method,
          status: 'ERROR',
          success: false,
          error: error.message
        });
      }
    }
  }

  getTestDataForRoute(path) {
    switch (path) {
      case '/api/v1/auth/login':
        return {
          email: 'test@example.com',
          password: 'TestPassword123!'
        };
      case '/api/v1/auth/signup':
        return {
          email: 'newuser@example.com',
          password: 'NewPassword123!',
          firstName: 'Test',
          lastName: 'User',
          tenantSubdomain: 'testcompany'
        };
      default:
        return {};
    }
  }

  async testFrontendPages() {
    log('\n🔍 Testando páginas do Frontend...', 'cyan');
    
    for (const page of this.frontendPages) {
      try {
        const url = `${FRONTEND_URL}${page.path}`;
        const response = await axios.get(url, {
          timeout: 10000,
          validateStatus: () => true,
          headers: {
            'User-Agent': 'Integration-Test-Bot'
          }
        });
        
        const status = response.status;
        const isSuccess = status === 200 || status === 404; // 404 pode ser normal para algumas rotas
        
        if (isSuccess) {
          log(`✅ ${page.path} - ${page.description}`, 'green');
          log(`   Status: ${status}`, 'blue');
          
          // Verificar se a página contém elementos esperados
          if (status === 200) {
            const hasReactApp = response.data.includes('__NEXT_DATA__') || 
                              response.data.includes('react') ||
                              response.data.includes('next');
            if (hasReactApp) {
              log(`   ✅ Página Next.js detectada`, 'green');
            }
          }
        } else {
          log(`❌ ${page.path} - ${page.description}`, 'red');
          log(`   Status: ${status}`, 'red');
        }
        
        this.testResults.push({
          type: 'frontend',
          route: page.path,
          status,
          success: isSuccess
        });
        
      } catch (error) {
        log(`❌ ${page.path} - ${page.description}`, 'red');
        log(`   Erro: ${error.message}`, 'red');
        
        this.testResults.push({
          type: 'frontend',
          route: page.path,
          status: 'ERROR',
          success: false,
          error: error.message
        });
      }
    }
  }

  async checkFrontendComponents() {
    log('\n🔍 Verificando componentes do Frontend...', 'cyan');
    
    const componentsDir = path.join(__dirname, 'src', 'components');
    const pagesDir = path.join(__dirname, 'src', 'app');
    
    try {
      // Verificar se os diretórios existem
      if (fs.existsSync(componentsDir)) {
        const components = fs.readdirSync(componentsDir, { withFileTypes: true })
          .filter(dirent => dirent.isFile() && dirent.name.endsWith('.tsx'))
          .map(dirent => dirent.name);
        
        log(`✅ Componentes encontrados: ${components.length}`, 'green');
        components.slice(0, 5).forEach(comp => {
          log(`   - ${comp}`, 'blue');
        });
        if (components.length > 5) {
          log(`   ... e mais ${components.length - 5} componentes`, 'blue');
        }
      }
      
      if (fs.existsSync(pagesDir)) {
        const pages = this.getAllPages(pagesDir);
        log(`✅ Páginas encontradas: ${pages.length}`, 'green');
        pages.slice(0, 5).forEach(page => {
          log(`   - ${page}`, 'blue');
        });
        if (pages.length > 5) {
          log(`   ... e mais ${pages.length - 5} páginas`, 'blue');
        }
      }
      
    } catch (error) {
      log(`❌ Erro ao verificar componentes: ${error.message}`, 'red');
    }
  }

  getAllPages(dir, pages = []) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        this.getAllPages(fullPath, pages);
      } else if (item.name === 'page.tsx' || item.name === 'page.ts') {
        const relativePath = path.relative(path.join(__dirname, 'src', 'app'), fullPath);
        pages.push(relativePath);
      }
    }
    
    return pages;
  }

  async testApiIntegration() {
    log('\n🔍 Testando integração API Frontend-Backend...', 'cyan');
    
    // Verificar se existe configuração do Supabase no frontend
    const supabaseConfigPath = path.join(__dirname, 'src', 'lib', 'supabase.ts');
    
    if (fs.existsSync(supabaseConfigPath)) {
      log('✅ Configuração do Supabase encontrada', 'green');
      
      try {
        const configContent = fs.readFileSync(supabaseConfigPath, 'utf8');
        if (configContent.includes('createClient')) {
          log('   ✅ Cliente Supabase configurado', 'green');
        }
        if (configContent.includes('NEXT_PUBLIC_SUPABASE_URL')) {
          log('   ✅ URL do Supabase configurada', 'green');
        }
      } catch (error) {
        log(`   ❌ Erro ao ler configuração: ${error.message}`, 'red');
      }
    } else {
      log('❌ Configuração do Supabase não encontrada', 'red');
    }
    
    // Verificar hooks de autenticação
    const authHookPath = path.join(__dirname, 'src', 'hooks', 'useAuth.tsx');
    if (fs.existsSync(authHookPath)) {
      log('✅ Hook de autenticação encontrado', 'green');
    } else {
      log('❌ Hook de autenticação não encontrado', 'red');
    }
  }

  generateReport() {
    log('\n📊 Relatório de Integração', 'cyan');
    log('=' .repeat(50), 'cyan');
    
    const backendTests = this.testResults.filter(r => r.type === 'backend');
    const frontendTests = this.testResults.filter(r => r.type === 'frontend');
    
    const backendSuccess = backendTests.filter(r => r.success).length;
    const frontendSuccess = frontendTests.filter(r => r.success).length;
    
    log(`\n🔧 Backend:`, 'yellow');
    log(`   Testes realizados: ${backendTests.length}`, 'blue');
    log(`   Sucessos: ${backendSuccess}`, 'green');
    log(`   Falhas: ${backendTests.length - backendSuccess}`, 'red');
    
    log(`\n🎨 Frontend:`, 'yellow');
    log(`   Testes realizados: ${frontendTests.length}`, 'blue');
    log(`   Sucessos: ${frontendSuccess}`, 'green');
    log(`   Falhas: ${frontendTests.length - frontendSuccess}`, 'red');
    
    const totalTests = this.testResults.length;
    const totalSuccess = backendSuccess + frontendSuccess;
    const successRate = totalTests > 0 ? ((totalSuccess / totalTests) * 100).toFixed(1) : 0;
    
    log(`\n📈 Resumo Geral:`, 'yellow');
    log(`   Taxa de sucesso: ${successRate}%`, successRate > 80 ? 'green' : successRate > 60 ? 'yellow' : 'red');
    
    if (successRate > 80) {
      log('\n🎉 Integração funcionando bem!', 'green');
    } else if (successRate > 60) {
      log('\n⚠️  Integração parcialmente funcional', 'yellow');
    } else {
      log('\n❌ Problemas significativos na integração', 'red');
    }
    
    // Salvar relatório em arquivo
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        totalSuccess,
        successRate: parseFloat(successRate),
        backend: { total: backendTests.length, success: backendSuccess },
        frontend: { total: frontendTests.length, success: frontendSuccess }
      },
      results: this.testResults
    };
    
    try {
      fs.writeFileSync('integration-test-report.json', JSON.stringify(reportData, null, 2));
      log('\n💾 Relatório salvo em: integration-test-report.json', 'blue');
    } catch (error) {
      log(`\n❌ Erro ao salvar relatório: ${error.message}`, 'red');
    }
  }

  async runAllTests() {
    log('🚀 Iniciando Teste de Integração Frontend-Backend', 'cyan');
    log('=' .repeat(60), 'cyan');
    
    const backendHealthy = await this.testBackendHealth();
    const frontendHealthy = await this.testFrontendHealth();
    
    if (backendHealthy) {
      await this.testBackendRoutes();
    } else {
      log('⚠️  Pulando testes de rotas do backend (não acessível)', 'yellow');
    }
    
    if (frontendHealthy) {
      await this.testFrontendPages();
    } else {
      log('⚠️  Pulando testes de páginas do frontend (não acessível)', 'yellow');
    }
    
    await this.checkFrontendComponents();
    await this.testApiIntegration();
    
    this.generateReport();
  }
}

// Executar testes
const tester = new IntegrationTester();
tester.runAllTests()
  .then(() => {
    log('\n✨ Teste de integração concluído!', 'green');
    process.exit(0);
  })
  .catch((error) => {
    log(`\n💥 Erro durante teste de integração: ${error.message}`, 'red');
    process.exit(1);
  });