# 🚀 Guia de Setup Rápido - Smart Spend Alerts

## ❌ Problema: "Missing Supabase environment variables"

### ✅ **Solução Implementada**

O arquivo `.env.local` foi criado automaticamente com as variáveis corretas do Supabase.

### 📁 **Arquivo Criado: `.env.local`**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://zztdqxjxjhqddtqpramt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dGRxeGp4amhxZGR0cXByYW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODEyNzksImV4cCI6MjA4MTU1NzI3OX0.fNqyP49ogguPOkhUo0HTLQjxSk3gfjrIDQQL4GFC8vA
```

---

## 🔧 **Como Resolver (Passo a Passo)**

### **1. Parar o Servidor (se estiver rodando)**
```bash
# No terminal onde está rodando o npm run dev
Ctrl + C
```

### **2. Verificar se o arquivo .env.local existe**
```bash
cd /Users/luccalacerda/FINANCEIRO/smart-spend-alerts
ls -la | grep .env
```

**Deve mostrar:**
- `.env.example` ✅
- `.env.local` ✅

### **3. Verificar conteúdo do .env.local**
```bash
cat .env.local
```

**Deve conter:**
```
VITE_SUPABASE_URL=https://zztdqxjxjhqddtqpramt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **4. Reiniciar o Servidor**
```bash
npm run dev
```

### **5. Verificar se Funcionou**
- ✅ Não deve mais aparecer o erro "Missing Supabase environment variables"
- ✅ O app deve carregar normalmente
- ✅ A página de perfil deve estar acessível

---

## 🔍 **Verificações Adicionais**

### **Se ainda der erro, verificar:**

#### **1. Sintaxe do arquivo .env.local**
```bash
# Verificar se não há espaços extras ou caracteres especiais
cat -A .env.local
```

#### **2. Permissões do arquivo**
```bash
# Dar permissão de leitura
chmod 644 .env.local
```

#### **3. Cache do Vite**
```bash
# Limpar cache e reinstalar
rm -rf node_modules/.vite
npm run dev
```

#### **4. Verificar se as variáveis estão sendo carregadas**
No console do navegador (F12), digite:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
```

**Deve retornar:**
- URL: `https://zztdqxjxjhqddtqpramt.supabase.co`
- KEY: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🎯 **Teste Final**

### **1. Acessar o App**
```
http://localhost:5173
```

### **2. Navegar para o Perfil**
```
http://localhost:5173/app/perfil
```

### **3. Verificar Conexão com Supabase**
- ✅ A página deve carregar sem erros
- ✅ Os campos do perfil devem aparecer
- ✅ Não deve haver erros no console

---

## 📋 **Checklist de Verificação**

- [ ] ✅ Arquivo `.env.local` existe
- [ ] ✅ Contém `VITE_SUPABASE_URL`
- [ ] ✅ Contém `VITE_SUPABASE_ANON_KEY`
- [ ] ✅ Servidor reiniciado após criar o arquivo
- [ ] ✅ Não há erros no console do navegador
- [ ] ✅ App carrega normalmente
- [ ] ✅ Página de perfil acessível

---

## 🚨 **Se Ainda Não Funcionar**

### **Criar o arquivo manualmente:**

1. **Criar arquivo `.env.local`** na raiz do projeto:
```bash
touch .env.local
```

2. **Adicionar conteúdo:**
```bash
echo 'VITE_SUPABASE_URL=https://zztdqxjxjhqddtqpramt.supabase.co' > .env.local
echo 'VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dGRxeGp4amhxZGR0cXByYW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODEyNzksImV4cCI6MjA4MTU1NzI3OX0.fNqyP49ogguPOkhUo0HTLQjxSk3gfjrIDQQL4GFC8vA' >> .env.local
```

3. **Reiniciar servidor:**
```bash
npm run dev
```

---

## ✅ **Problema Resolvido!**

Após seguir esses passos, o erro **"Missing Supabase environment variables"** deve desaparecer e o app deve funcionar normalmente.

### **Próximos passos:**
1. ✅ Testar a página de perfil
2. ✅ Configurar dados pessoais
3. ✅ Configurar webhook do n8n
4. ✅ Testar notificações

**O sistema está pronto para uso! 🎉**
