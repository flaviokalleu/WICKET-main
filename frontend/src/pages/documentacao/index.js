import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Typography, Grid, Select, MenuItem, FormControl, InputLabel, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(3),
    paddingBottom: 100,
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #333333',
    minHeight: '80vh',
  },
  mainHeader: {
    marginTop: theme.spacing(1),
    color: '#ffffff',
    fontSize: '2rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
  elementMargin: {
    padding: theme.spacing(2),
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    margin: theme.spacing(1, 0),
    border: '1px solid #333333',
  },
  formContainer: {
    width: "100%",
    margin: theme.spacing(2, 0),
    marginBottom: theme.spacing(4),
  },
  select: {
    width: "100%",
    maxWidth: 600,
    height: 50,
    border: "2px solid #437db5",
    borderRadius: "8px",
    "&:hover": {
      borderColor: "#5a8bc7",
    },
    "&.Mui-focused": {
      borderColor: "#437db5",
    },
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    fontSize: "16px",
    '& .MuiSelect-icon': {
      color: '#ffffff',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#437db5',
    },
    '& .MuiMenuItem-root': {
      backgroundColor: '#2a2a2a',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#3a3a3a',
      },
    },
  },
  inputLabel: {
    color: "#437db5",
    fontWeight: "600",
    fontSize: "16px",
    width: "100%",
    '&.Mui-focused': {
      color: '#437db5',
    },
  },
  preCode: {
    backgroundColor: "#333333",
    color: "#ffffff",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #444444",
    fontSize: "14px",
    fontFamily: "'Courier New', monospace",
    lineHeight: "1.5",
    overflow: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    marginTop: "12px",
  },
  sectionTitle: {
    color: "#437db5",
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: theme.spacing(2),
    borderBottom: "2px solid #437db5",
    paddingBottom: theme.spacing(1),
  },
  endpointTitle: {
    color: "#ffffff",
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: theme.spacing(1),
  },
  urlText: {
    color: "#00d4aa",
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: theme.spacing(1),
    wordBreak: "break-all",
  },
  methodBadge: {
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
    marginRight: "8px",
    '&.GET': {
      backgroundColor: '#4CAF50',
      color: '#ffffff',
    },
    '&.POST': {
      backgroundColor: '#2196F3',
      color: '#ffffff',
    },
    '&.PUT': {
      backgroundColor: '#FF9800',
      color: '#ffffff',
    },
    '&.DELETE': {
      backgroundColor: '#F44336',
      color: '#ffffff',
    },
  },
}));

const ApiDocumentation = () => {
  const classes = useStyles();
  const [language, setLanguage] = useState("React");

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const getCodeExample = (endpoint, method, url, body = null) => {
    switch (language) {
      case "React":
        return `fetch('${url}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {token_de_autenticacao}'
  },
  ${body ? `body: JSON.stringify(${JSON.stringify(body, null, 2)})` : ""}
})
  .then(response => response.json())
  .then(data => console.log(data));`;

      case "Javascript":
        return `fetch('${url}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {token_de_autenticacao}'
  },
  ${body ? `body: JSON.stringify(${JSON.stringify(body, null, 2)})` : ""}
})
  .then(response => response.json())
  .then(data => console.log(data));`;

      case "Python":
        return `import requests

url = '${url}'
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token_de_autenticacao}'
}
${body ? `data = ${JSON.stringify(body, null, 2)}` : ""}
response = requests.${method.toLowerCase()}(${body ? "url, json=data, headers=headers" : "url, headers=headers"})

print(response.json())`;

      case "PHP":
        return `<?php
$url = '${url}';
$headers = [
  'Content-Type: application/json',
  'Authorization: Bearer {token_de_autenticacao}'
];
${body ? `$data = ${JSON.stringify(body, null, 2)};` : ""}

$options = [
  'http' => [
    'method' => '${method}',
    'header' => implode("\\r\\n", $headers),
    ${body ? `'content' => json_encode($data)` : ""}
  ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

echo $response;`;

      case "Vue":
        return `<template>
  <div>
    <button @click="makeRequest">${method} Request</button>
  </div>
</template>

<script>
export default {
  methods: {
    makeRequest() {
      fetch('${url}', {
        method: '${method}',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer {token_de_autenticacao}'
        },
        ${body ? `body: JSON.stringify(${JSON.stringify(body, null, 2)})` : ""}
      })
        .then(response => response.json())
        .then(data => console.log(data));
    }
  }
};
</script>`;

      case "Laravel":
        return `<?php
use Illuminate\\Support\\Facades\\Http;

$response = Http::withHeaders([
  'Authorization' => 'Bearer {token_de_autenticacao}'
])->${method.toLowerCase()}('${url}'${body ? ", " + JSON.stringify(body, null, 2) : ""});

dd($response->json());`;

      default:
        return `// Código não disponível para a linguagem selecionada.`;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/whiticket_postman.json';  // Path to the file you want to download
    link.download = 'whiticket_postman.json';
    link.click();
  };

  return (
    <Paper className={classes.mainPaper} variant="outlined">
      <Typography variant="h4" className={classes.mainHeader}>
        📚 Documentação da API
      </Typography>

      <FormControl className={classes.formContainer}>
        <InputLabel id="language-select-label" className={classes.inputLabel}>
          🔧 Selecione a Linguagem de Programação
        </InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={language}
          onChange={handleLanguageChange}
          className={classes.select}
          MenuProps={{
            PaperProps: {
              style: {
                backgroundColor: '#2a2a2a',
                color: '#ffffff',
                border: '1px solid #333333',
              },
            },
          }}
        >
          <MenuItem value="React" style={{ backgroundColor: '#2a2a2a', color: '#ffffff' }}>
            ⚛️ React
          </MenuItem>
          <MenuItem value="Javascript" style={{ backgroundColor: '#2a2a2a', color: '#ffffff' }}>
            🟨 JavaScript
          </MenuItem>
          <MenuItem value="Python" style={{ backgroundColor: '#2a2a2a', color: '#ffffff' }}>
            🐍 Python
          </MenuItem>
          <MenuItem value="PHP" style={{ backgroundColor: '#2a2a2a', color: '#ffffff' }}>
            🐘 PHP
          </MenuItem>
          <MenuItem value="Vue" style={{ backgroundColor: '#2a2a2a', color: '#ffffff' }}>
            💚 Vue.js
          </MenuItem>
          <MenuItem value="Laravel" style={{ backgroundColor: '#2a2a2a', color: '#ffffff' }}>
            🔴 Laravel
          </MenuItem>
        </Select>
      </FormControl>

      {/* Exemplo Introdutório */}
      <div className={classes.elementMargin}>
        <Typography className={classes.endpointTitle}>
          💡 Exemplo de código em {language}:
        </Typography>
        <pre className={classes.preCode}>
          {getCodeExample("POST", "https://demo.whiticket.com.br/api/auth/login", {
            username: "usuario",
            password: "senha",
          })}
        </pre>
      </div>

      {/* 1. Autenticação */}
      <Typography className={classes.sectionTitle}>
        🔐 1. Autenticação
      </Typography>
      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} POST`}>POST</span>
            /auth/login
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo.whiticket.com.br/api/auth/login
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("POST", "https://demo.whiticket.com.br/api/auth/login", {
              username: "usuario",
              password: "senha",
            })}
          </pre>
        </div>
      </Grid>

      {/* 2. Tickets */}
      <Typography className={classes.sectionTitle}>
        🎫 2. Tickets
      </Typography>
      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} GET`}>GET</span>
            /ticket/list
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo.whiticket.com.br/api/ticket/list
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("GET", "https://demo.whiticket.com.br/api/ticket/list")}
          </pre>
        </div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} POST`}>POST</span>
            /ticket/create
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo.whiticket.com.br/api/ticket/create
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("POST", "https://demo.whiticket.com.br/api/ticket/create", {
              title: "Novo ticket de teste",
              description: "Descrição do problema",
              priority: "alta",
            })}
          </pre>
        </div>
      </Grid>

      {/* 3. Mensagens */}
      <Typography className={classes.sectionTitle}>
        💬 3. Mensagens
      </Typography>
      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} GET`}>GET</span>
            /message/list
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo.whiticket.com.br/api/message/list
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("GET", "https://demo.whiticket.com.br/api/message/list")}
          </pre>
        </div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} POST`}>POST</span>
            /message/send
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo.whiticket.com.br/api/message/send
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("POST", "https://demo.whiticket.com.br/api/message/send", {
              recipient: "João",
              message: "Oi, como você está?",
            })}
          </pre>
        </div>
      </Grid>

      {/* 4. Contatos */}
      <Typography className={classes.sectionTitle}>
        👥 4. Contatos
      </Typography>
      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} GET`}>GET</span>
            /contact/list
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo.whiticket.com.br/api/contact/list
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("GET", "https://demo.whiticket.com.br/api/contact/list")}
          </pre>
        </div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} POST`}>POST</span>
            /contact/create
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo.whiticket.com.br/api/contact/create
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("POST", "https://demo.whiticket.com.br/api/contact/create", {
              name: "Eurico Junior",
              phone: "19971395449",
            })}
          </pre>
        </div>
      </Grid>

      {/* 5. Faturas */}
      <Typography className={classes.sectionTitle}>
        💰 5. Faturas
      </Typography>
      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} GET`}>GET</span>
            /invoice/list
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo.whiticket.com.br/api/invoice/list
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("GET", "https://demo.whiticket.com.br/api/invoice/list")}
          </pre>
        </div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} POST`}>POST</span>
            /invoice/create
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo.whiticket.com.br/api/invoice/create
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("POST", "https://demo.whiticket.com.br/api/invoice/create", {
              amount: 200.0,
              due_date: "2025-03-10",
              customer_id: 1,
            })}
          </pre>
        </div>
      </Grid>

      {/* 6. Webhook */}
      <Typography className={classes.sectionTitle}>
        🔗 6. Webhook
      </Typography>
      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} POST`}>POST</span>
            /webhook
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo.whiticket.com.br/api/webhook
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("POST", "https://demo.whiticket.com.br/api/webhook", {
              event: "new_ticket",
              data: {
                ticket_id: 1,
                title: "Novo problema",
                status: "aberto",
              },
            })}
          </pre>
        </div>
      </Grid>

      {/* 7. Sessões do WhatsApp */}
      <Typography className={classes.sectionTitle}>
        📱 7. Sessões do WhatsApp
      </Typography>
      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} POST`}>POST</span>
            /whatsapp/session
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo.whiticket.com.br/api/whatsapp/session
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("POST", "https://demo.whiticket.com.br/api/whatsapp/session", {
              phone_number: "19971395449",
              session_name: "Sessão WhatsApp 1",
            })}
          </pre>
        </div>
      </Grid>

      {/* 8. Agendamentos */}
      <Typography className={classes.sectionTitle}>
        📅 8. Agendamentos
      </Typography>
      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} GET`}>GET</span>
            /schedules
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo5.whiticket.com.br/schedules
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("GET", "https://demo5.whiticket.com.br/schedules")}
          </pre>
        </div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} POST`}>POST</span>
            /schedules
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo5.whiticket.com.br/schedules
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("POST", "https://demo5.whiticket.com.br/schedules", {
              title: "Reunião de Equipe",
              description: "Reunião para discussão de metas",
              date: "2025-02-28T14:00:00",
              location: "Sala 1",
            })}
          </pre>
        </div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} PUT`}>PUT</span>
            /schedules/:scheduleId
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo5.whiticket.com.br/schedules/1
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("PUT", "https://demo5.whiticket.com.br/schedules/1", {
              title: "Reunião de Equipe Atualizada",
              description: "Reunião para revisão de progresso",
              date: "2025-02-28T16:00:00",
              location: "Sala 2",
            })}
          </pre>
        </div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} GET`}>GET</span>
            /schedules/:scheduleId
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo5.whiticket.com.br/schedules/1
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("GET", "https://demo5.whiticket.com.br/schedules/1")}
          </pre>
        </div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} DELETE`}>DELETE</span>
            /schedules/:scheduleId
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo5.whiticket.com.br/schedules/1
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("DELETE", "https://demo5.whiticket.com.br/schedules/1")}
          </pre>
        </div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} POST`}>POST</span>
            /schedules/:id/media-upload
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo5.whiticket.com.br/schedules/1/media-upload
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("POST", "https://demo5.whiticket.com.br/schedules/1/media-upload")}
          </pre>
        </div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <div className={classes.elementMargin}>
          <Typography className={classes.endpointTitle}>
            <span className={`${classes.methodBadge} DELETE`}>DELETE</span>
            /schedules/:id/media-upload
          </Typography>
          <Typography className={classes.urlText}>
            🌐 https://demo5.whiticket.com.br/schedules/1/media-upload
          </Typography>
          <pre className={classes.preCode}>
            {getCodeExample("DELETE", "https://demo5.whiticket.com.br/schedules/1/media-upload")}
          </pre>
        </div>
      </Grid>
    </Paper>
  );
};

export default ApiDocumentation;