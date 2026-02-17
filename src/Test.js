function onChange(e) {
  const estilos = {
    rockAndRoll: "https://www.corealternativas.com/estilo-rock-and-roll",
    basicoMinimalista:
      "https://www.corealternativas.com/estilo-basico-minimalista",
    romanticoFemme: "https://www.corealternativas.com/estilo-romantico-femme",
    bohemioOrganico: "https://www.corealternativas.com/estilo-bohemio-organico",
    clasicoElegante: "https://www.corealternativas.com/estilo-clasico-elegante",
    deportivoUrbano: "https://www.corealternativas.com/estilo-deportivo-urbano",
    vintageRetro: "https://www.corealternativas.com/estilo-vintage-retro",
    gotico: "https://www.corealternativas.com/estilo-gotico-dramatico",
    aventurerx: "https://www.corealternativas.com/estilo-aventurerx",
    eclecticoArtistico:
      "https://www.corealternativas.com/estilo-maximalista-eclectico",
  };

  const imgUrls = {
    rockAndRoll:
      "https://drive.google.com/file/d/1TLwmH_G34reSQCijbbPjLfa4ukkL8Jo2/view?usp=sharing",
    basicoMinimalista:
      "https://drive.google.com/file/d/1CCqedBw-DiwKRP2pb7kEKKtgXjdS_O5H/view?usp=sharing",
    romanticoFemme:
      "https://drive.google.com/file/d/17IOKs26ZBVl2YkdvIEyzbmXiIzl7TT-n/view?usp=sharing",
    bohemioOrganico:
      "https://drive.google.com/file/d/1qTYBegqbdjr7Qwdi7QW_DYnIm7U6XN72/view?usp=sharing",
    clasicoElegante:
      "https://drive.google.com/file/d/1w0JIbq6jrBl8dBm31Ud6aVPd9S5IPqYC/view?usp=sharing",
    deportivoUrbano:
      "https://drive.google.com/file/d/1bCcx8QCdTFwTsuagEE3nlMa6HTzsbNcq/view?usp=sharing",
    vintageRetro:
      "https://drive.google.com/file/d/16vCMA7agmog-fk_-KhTN5Xrf2zGEf3WD/view?usp=sharing",
    gotico:
      "https://drive.google.com/file/d/1eclsaSDc1_VoUTH1OI6JsqiGNtqT7a9a/view?usp=sharing",
    aventurerx:
      "https://drive.google.com/file/d/1YCwGa2wfvI63r5yYC_d6uQK2WMELfDeQ/view?usp=sharing",
    eclecticoArtistico:
      "https://drive.google.com/file/d/13c2cX6CkKnmjs-fLVduxLNxhx_z5Ihrv/view?usp=sharing",
  };

  const estilosAdjetivos = {
    rockAndRoll: ["Rebelde", "Audaz", "Edgy", "Alternativa/o/e", "Intensa/o/e"],
    basicoMinimalista: ["Simple", "Moderna/o/e", "Relajada/o/e"],
    romanticoFemme: [
      "Encantadora/e",
      "Dulce",
      "Sensual",
      "Delicada/o/e",
      "Romántica/o/e",
    ],
    bohemioOrganico: [
      "Desenfadada/o/e",
      "Hippie",
      "Natural",
      "Folk/Bohemia/o/e",
    ],
    clasicoElegante: [
      "Sofisticada/o/e",
      "Pulcra/o/e",
      "Atemporal",
      "Refinada/o/e",
      "Elegante",
      "Tradicional",
      "Formal",
      "Conservadora/o/e",
      "Académica/o/e",
    ],
    deportivoUrbano: [
      "Deportiva/o/e",
      "Cómoda/o/e",
      "Informal",
      "Activa/o/e",
      "Moderna/o/e",
    ],
    vintageRetro: ["Nostálgica/o/e", "Retro", "Vintage", "Pin-up (50s)"],
    gotico: [
      "Oscura/o/e",
      "Dramática/o/e",
      "Mística/o/e",
      "Subversiva/o/e",
      "Intrigante",
    ],
    aventurerx: ["Exploradora/o/e", "Natural", "Aventurera/o/e"],
    eclecticoArtistico: [
      "Creativa/o/e",
      "Diversa/o/e",
      "Original",
      "Personalizada/o/e",
      "Innovadora/o/e",
    ],
  };

  const arquetipos = {
    rockAndRoll: "Rock and Roll",
    basicoMinimalista: "Minimalista",
    romanticoFemme: "Romántico/Femme",
    bohemioOrganico: "Bohemio (Orgánico)",
    clasicoElegante: "Clásico/Elegante",
    deportivoUrbano: "Deportivo/Urbano",
    vintageRetro: "Vintage/Retro",
    gotico: "Gótico",
    aventurerx: "Aventurerx",
    eclecticoArtistico: "Ecléctico/Artístico",
  };

  function normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD") // split letters and diacritics
      .replace(/[\u0300-\u036f]/g, ""); // remove diacritics
  }

  function findMatchingStyles(inputString, estilosAdjetivos) {
    // Normalize input adjectives
    const inputAdjectives = inputString
      .split(",")
      .map((a) => normalize(a.trim()));

    // Count matches per style
    const matches = Object.entries(estilosAdjetivos).map(
      ([style, adjectives]) => {
        const count = adjectives.filter((adj) =>
          inputAdjectives.includes(normalize(adj)),
        ).length;
        return { style, count };
      },
    );

    // Filter out styles with 0 matches, sort by count desc, return only keys
    return matches
      .filter((m) => m.count > 0)
      .sort((a, b) => b.count - a.count)
      .map((m) => m.style);
  }

  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  function extractDriveId(url) {
    const s = String(url || "");
    const m =
      s.match(/drive\.google\.com\/file\/d\/([^/]+)/) ||
      s.match(/[?&]id=([^&]+)/);
    return m ? m[1] : null;
  }
  function driveToEmbedUrl(url) {
    if (!url) return "";
    if (/drive\.google\.com\/uc\?/.test(url)) return url;
    const id = extractDriveId(url);
    return id ? `https://drive.google.com/uc?export=view&id=${id}` : url;
  }

  // chip + imagen para una celda (una columna)
  function styleCellHTML(styleKey, arquetipos, estilos, imgUrls, brandText) {
    if (!styleKey) {
      return `<td style="width:50%;padding:0 8px 16px 8px;"></td>`;
    }
    const label = arquetipos[styleKey] || styleKey;
    const href = estilos[styleKey] || "#";
    const img = driveToEmbedUrl(imgUrls[styleKey] || "");

    return `
      <td style="width:50%;padding:0 8px 16px 8px;vertical-align:top;">
        <div style="display:inline-block;background:#EFF7F1;border:1px solid #D7EBDD;color:${brandText};
                    font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;
                    border-radius:999px;padding:6px 10px;margin:0 0 8px 0;">
          ${esc(label)}
        </div>
        <a href="${esc(
          href,
        )}" target="_blank" style="text-decoration:none;border:0;display:block;">
          <img src="${esc(img)}" alt="${esc(label)}"
               style="display:block;border:0;outline:none;text-decoration:none;width:100%;height:auto;">
        </a>
      </td>`;
  }

  // table grid 2 columnas (fila por cada par)
  function twoColumnGridHTML(keys, arquetipos, estilos, imgUrls, brandText) {
    let out =
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">';
    for (let i = 0; i < keys.length; i += 2) {
      const left = keys[i];
      const right = keys[i + 1] || null;
      out += `<tr>
        ${styleCellHTML(left, arquetipos, estilos, imgUrls, brandText)}
        ${styleCellHTML(right, arquetipos, estilos, imgUrls, brandText)}
      </tr>`;
    }
    out += "</table>";
    return out;
  }

  // --- plantilla principal con 2 columnas ---
  function buildCoreEmailHtml_2cols(
    name,
    matchingStyles,
    estilos,
    arquetipos,
    imgUrls,
    ownDescription,
    opts,
  ) {
    const {
      logoUrl = "https://images.squarespace-cdn.com/content/v1/6446be01262fb84cd63a5732/2fe1ed1b-7026-40c5-b12f-f332de4b6bae/logo+vertical-09.png?format=1500w",
      brandPrimary = "#1F7A5B",
      brandText = "#122B26",
      mutedBg = "#F3F5F3",
      senderName = "Equipo CORE Alternativas",
      ctaUrl = "https://www.corealternativas.com/estilismo-personalizado",
      ctaLabel = "Reservar asesoría",
    } = opts || {};

    const grid =
      matchingStyles && matchingStyles.length
        ? twoColumnGridHTML(
            matchingStyles,
            arquetipos,
            estilos,
            imgUrls,
            brandText,
          )
        : '<p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b7280;">No se encontraron arquetipos para mostrar.</p>';

    return `<!doctype html>
  <html lang="es"><head>
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta charset="utf-8"><title>Resultados de tu test</title>
  </head>
  <body style="margin:0;padding:0;background:${mutedBg};">
  <center style="width:100%;background:${mutedBg};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%"
         style="max-width:720px;background:#ffffff;margin:0 auto;">
    <!-- header -->
    <tr>
      <td style="padding:24px 24px 0 24px;text-align:left;">
        <img src="${esc(logoUrl)}" alt="CORE Alternativas Conscientes" width="120"
             style="display:block;border:0;outline:none;text-decoration:none;">
      </td>
    </tr>
  
    <!-- intro -->
    <tr>
      <td style="padding:16px 24px 0 24px;font-family:Arial, Helvetica, sans-serif;">
        <p style="margin:0 0 12px 0;font-size:16px;line-height:1.6;color:#111827;">Hola ${esc(
          name,
        )}!</p>
        <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#111827;">Gracias por hacer el test de estilo personal ✨</p>
        <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#111827;">
          <strong>Recordá:</strong> tu estilo no es fijo, evoluciona con vos. Somos personas multidimensionales y
          <em>nuestro estilo refleja esas mil historias.</em>
        </p>
        <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#111827;">
          En CORE definimos 10 arquetipos de estilo. Según lo que elegiste (<strong>${ownDescription}</strong>),
          tu estilo combina varios de ellos:
        </p>
        <p style="margin:0 0 8px 0;font-size:13px;line-height:1.6;color:#475467;">
          (<em>Hacé click ✨ en las imágenes para ver más</em>).
        </p>
      </td>
    </tr>
  
    <!-- grid 2 columnas -->
    <tr>
      <td style="padding:0 24px 0 24px;">
        ${grid}
      </td>
    </tr>
  
    <!-- ¿QUÉ TE PARECIÓ? -->
    <tr>
      <td style="padding:8px 24px 0 24px;font-family:Arial, Helvetica, sans-serif;">
        <p style="margin:0 0 6px 0;font-size:14px;letter-spacing:.3px;color:${brandText};font-weight:800;">¿QUÉ TE PARECIÓ?</p>
        <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#111827;">
          Ojalá te hayas visto representada en los arquetipos que seleccionaste. Si aparecieron arquetipos que no te parecen tan cercanos a tu estilo actual, quizá sean un estilo nuevo a explorar que puede representar una arista de tu personalidad de una forma nueva.
        </p>
      </td>
    </tr>
  
    <!-- ¿CÓMO LO APLICO? -->
    <tr>
      <td style="padding:8px 24px 0 24px;font-family:Arial, Helvetica, sans-serif;">
        <p style="margin:0 0 6px 0;font-size:14px;letter-spacing:.3px;color:${brandText};font-weight:800;">¿CÓMO LO APLICO?</p>
        <ul style="margin:0 0 12px 20px;padding:0;font-size:15px;line-height:1.6;color:#111827;">
          <li>Revisar tu guardarropas para identificar cómo podés armar los looks sugeridos con lo que ya tenés (<em>te sorprenderías</em>).</li>
          <li>Comparar con las sugerencias y entender si faltan algunas piezas claves. Priorizar compras responsables.</li>
          <li>Circular las prendas que no responden a cómo te querés presentar hoy (evitemos la fatiga visual de tener demasiadas prendas y no usarlas frecuentemente).</li>
        </ul>
      </td>
    </tr>
  
    <!-- ayuda + CTA -->
    <tr>
      <td style="padding:8px 24px 8px 24px;font-family:Arial, Helvetica, sans-serif;">
        <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#111827;">
          Si te gustaría tener ayuda para aplicar las sugerencias, también ofrecemos asesorías personalizadas.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="left" style="margin:4px 0 10px 0;">
          <tr>
            <td bgcolor="${brandPrimary}" style="border-radius:999px;">
              <a href="${esc(ctaUrl)}" target="_blank"
                 style="display:inline-block;padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.2;color:#ffffff;text-decoration:none;font-weight:700;">
                ${esc(ctaLabel)}
              </a>
            </td>
          </tr>
        </table>
        <br>
        <br>
        <br>
        <p style="margin:12px 0 0 0;font-size:15px;line-height:1.6;color:#111827;">
          Un abrazo,<br><strong>${esc(senderName)}</strong>
        </p>
      </td>
    </tr>
  
    <!-- pie -->
    <tr>
      <td style="padding:16px 24px 24px 24px;border-top:1px solid #eee;">
        <p style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:1.5;color:#6b7280;">
          Recibís este correo porque completaste el test de estilos de CORE Alternativas.
        </p>
      </td>
    </tr>
  </table>
  </center>
  </body></html>`;
  }

  try {
    if (!e) return;
    const sheet = e?.range?.getSheet();
    const sheetName = sheet?.getName();

    // ✅ Only run for the specific sheet where Typeform puts responses
    if (sheetName !== "¿Cuál es mi estilo personal? (copy)") {
      return;
    }

    // Get headers (first row)
    const headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    // Get submitted row data
    const row = e.range.getRow();
    const data = sheet
      .getRange(row, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    // Create object {header: value}
    const rowData = {};
    headers.forEach((header, i) => {
      rowData[header] = data[i];
    });

    const name = rowData["Hello, what's your name?"];

    const email = rowData["Dejanos tu email para recibir tus resultados 🌱"];
    const ownDescription =
      rowData[
        "Decinos una característica que defina qué te gustaría proyectar cuando alguien te ve."
      ];
    const adjetivos =
      rowData[
        "Bien, ahora seleccioná las palabras que más se acerquen a las características que identificaste."
      ];

    // ---- PROCESSING ----

    const matchingStyles = findMatchingStyles(adjetivos, estilosAdjetivos);
    const matchingStylesUrls = matchingStyles.map((style) => estilos[style]);
    const matchingStylesArquetipos = matchingStyles.map(
      (style) => arquetipos[style],
    );
    const matchingStylesImgUrls = matchingStyles.map((style) => imgUrls[style]);

    // ---- EMAIL CONTENT ----
    const subject = `Hola, ${name}! Estos son los resultados de tu test.`;

    const html = buildCoreEmailHtml_2cols(
      name,
      matchingStyles,
      estilos, // mapa: key -> URL destino
      arquetipos, // mapa: key -> Título visible ("Clásico/Elegante")
      imgUrls, // mapa: key -> URL de imagen (ver paso 2)
      ownDescription,
      {
        ctaUrl: "https://www.corealternativas.com/estilismo-personalizado",
        ctaLabel: "Reservar asesoría",
      },
    );

    // ---- SEND EMAIL ----
    GmailApp.sendEmail(email, subject, "", {
      htmlBody: html,
      name: "Core Alternativas Conscientes y con Estilo",
      replyTo: "core.alternativas@gmail.com",
    });
  } catch (err) {
    console.error("Error in onChange:", err);
  }
}
