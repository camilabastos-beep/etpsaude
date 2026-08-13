# Sentinela

Plataforma Sentinela - Avaliação Biopsicossocial e Cronotipo

Conteúdo inicial gerado automaticamente por Copilot.

Instruções rápidas:

1. Crie um arquivo .env baseado em .env.example
2. Rode `docker-compose up --build` para subir o banco e a aplicação.
3. Rode `docker-compose exec app node src/scripts/run_migrations.js` para aplicar as migrations.
4. Rode `docker-compose exec app node src/scripts/seed_admin.js` para criar o usuário ADMIN inicial.

Usuário ADMIN padrão criado pelo seed: camila.bastos@etp-transparana.com.br (senha temporária: Sentinela123!) — recomendamos trocar a senha após o primeiro login.
