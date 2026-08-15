/* =====================================================
   HEADER / MENU
===================================================== */

const header = document.querySelector(".header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
        header?.classList.add("scrolled");
    } else {
        header?.classList.remove("scrolled");
    }
});

menuToggle?.addEventListener("click", () => {
    nav?.classList.toggle("mobile-active");
});


/* =====================================================
   ANIMAÇÕES AO ROLAR
===================================================== */

const animatedElements = document.querySelectorAll(
    ".fade-in, .fade-left, .fade-right, .scale-in"
);

const animationObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                animationObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

animatedElements.forEach((element) => {
    animationObserver.observe(element);
});


/* =====================================================
   CALCULADORA SOLAR
===================================================== */

const billInput = document.querySelector("#bill-input");
const billSlider = document.querySelector("#bill-slider");

const monthlySaving = document.querySelector("#monthly-saving");
const annualSaving = document.querySelector("#annual-saving");
const systemSize = document.querySelector("#system-size");
const panelCount = document.querySelector("#panel-count");

const reductionFill = document.querySelector("#reduction-fill");
const reductionPercent = document.querySelector("#reduction-percent");

const propertyOptions = document.querySelectorAll(".property-option");

let selectedProperty = "residencial";


/* =====================================================
   CONFIGURAÇÃO DOS TIPOS DE IMÓVEL
===================================================== */

const propertyData = {
    residencial: {
        factor: 0.115,
        panelsFactor: 0.70
    },

    comercial: {
        factor: 0.125,
        panelsFactor: 0.72
    },

    rural: {
        factor: 0.105,
        panelsFactor: 0.68
    }
};


/* =====================================================
   FORMATAÇÃO DE MOEDA
===================================================== */

function formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


/* =====================================================
   ATUALIZAR CALCULADORA
===================================================== */

function updateCalculator() {

    if (!billInput) return;

    let bill = parseFloat(
        String(billInput.value)
            .replace(",", ".")
            .replace(/[^\d.]/g, "")
    );

    if (isNaN(bill) || bill < 0) {
        bill = 0;
    }

    if (billSlider) {
        const sliderValue = parseFloat(billSlider.value);

        if (
            document.activeElement === billSlider &&
            !isNaN(sliderValue)
        ) {
            bill = sliderValue;
            billInput.value = sliderValue;
        }
    }

    const property = propertyData[selectedProperty];

    if (!property) return;


    /* Economia estimada */

    const saving = bill * 0.90;

    const annual = saving * 12;


    /* Tamanho aproximado do sistema */

    const estimatedSystem = bill * property.factor;

    const roundedSystem =
        Math.max(1, Math.round(estimatedSystem * 10) / 10);


    /* Quantidade aproximada de painéis */

    const estimatedPanels =
        Math.max(
            2,
            Math.ceil(roundedSystem / property.panelsFactor)
        );


    /* Redução */

    const reduction = bill > 0
        ? Math.min(95, Math.round((saving / bill) * 100))
        : 0;


    /* Atualizar HTML */

    if (monthlySaving) {
        monthlySaving.textContent = formatCurrency(saving);
    }

    if (annualSaving) {
        annualSaving.textContent = formatCurrency(annual);
    }

    if (systemSize) {
        systemSize.textContent =
            `${roundedSystem.toFixed(1).replace(".", ",")} kWp`;
    }

    if (panelCount) {
        panelCount.textContent =
            `${estimatedPanels} painéis`;
    }

    if (reductionPercent) {
        reductionPercent.textContent = `${reduction}%`;
    }

    if (reductionFill) {
        reductionFill.style.width = `${reduction}%`;
    }


    /* Guardar dados para o orçamento */

    window.solarSimulation = {
        bill,
        saving,
        annual,
        system: roundedSystem,
        panels: estimatedPanels,
        reduction,
        property: selectedProperty
    };
}


/* =====================================================
   INPUT DA CONTA
===================================================== */

billInput?.addEventListener("input", () => {

    let value = billInput.value.replace(/[^\d.,]/g, "");

    billInput.value = value;

    updateCalculator();
});


/* =====================================================
   SLIDER
===================================================== */

billSlider?.addEventListener("input", () => {

    billInput.value = billSlider.value;

    updateCalculator();
});


/* =====================================================
   TIPO DE IMÓVEL
===================================================== */

propertyOptions.forEach((option) => {

    option.addEventListener("click", () => {

        propertyOptions.forEach((item) => {
            item.classList.remove("active");
        });

        option.classList.add("active");

        selectedProperty =
            option.dataset.property ||
            option.dataset.type ||
            "residencial";

        updateCalculator();
    });

});


/* =====================================================
   INICIALIZAÇÃO DA CALCULADORA
===================================================== */

updateCalculator();


/* =====================================================
   FAQ
===================================================== */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {

    const question = item.querySelector(".faq-question");

    question?.addEventListener("click", () => {

        const wasActive = item.classList.contains("active");

        faqItems.forEach((faq) => {
            faq.classList.remove("active");
        });

        if (!wasActive) {
            item.classList.add("active");
        }

    });

});


/* =====================================================
   ORÇAMENTO AUTOMÁTICO
===================================================== */

const budgetForm = document.querySelector("#budget-form");

const budgetName = document.querySelector("#budget-name");
const budgetPhone = document.querySelector("#budget-phone");
const budgetEmail = document.querySelector("#budget-email");
const budgetBill = document.querySelector("#budget-bill");
const budgetProperty = document.querySelector("#budget-property");
const budgetMessage = document.querySelector("#budget-message");
const budgetEmailButton = document.querySelector("#budget-email-button");


/* =====================================================
   PREENCHER ORÇAMENTO COM A SIMULAÇÃO
===================================================== */

function fillBudgetFromSimulation() {

    const simulation = window.solarSimulation;

    if (!simulation) {
        updateCalculator();
    }

    const data = window.solarSimulation;

    if (!data) return;


    /* Conta */

    if (budgetBill) {
        budgetBill.value =
            Number(data.bill).toFixed(2).replace(".", ",");
    }


    /* Tipo de imóvel */

    if (budgetProperty) {

        const propertyValue =
            data.property === "residencial"
                ? "Residencial"
                : data.property === "comercial"
                    ? "Comercial"
                    : "Rural";

        let optionFound = false;

        Array.from(budgetProperty.options).forEach((option) => {

            const text = option.textContent
                .trim()
                .toLowerCase();

            if (
                text.includes(data.property) ||
                text.includes(propertyValue.toLowerCase())
            ) {
                budgetProperty.value = option.value;
                optionFound = true;
            }

        });

        if (!optionFound) {
            budgetProperty.value = data.property;
        }
    }


    /* Mensagem */

    if (budgetMessage) {

        budgetMessage.value =
`Olá! Gostaria de solicitar um orçamento para energia solar.

Simulação realizada no site:

• Conta de energia: ${formatCurrency(data.bill)}
• Economia mensal estimada: ${formatCurrency(data.saving)}
• Economia anual estimada: ${formatCurrency(data.annual)}
• Sistema estimado: ${data.system.toFixed(1).replace(".", ",")} kWp
• Painéis estimados: ${data.panels}
• Redução estimada: ${data.reduction}%
• Tipo de imóvel: ${data.property}

Gostaria de receber uma avaliação e um orçamento mais detalhado.`;
    }
}


/* =====================================================
   BOTÕES DE ORÇAMENTO
===================================================== */

const budgetButtons = document.querySelectorAll(
    ".calculator-button, [data-budget], .btn-budget"
);

budgetButtons.forEach((button) => {

    button.addEventListener("click", (event) => {

        event.preventDefault();

        updateCalculator();

        fillBudgetFromSimulation();

        const budgetSection =
            document.querySelector("#orcamento") ||
            document.querySelector("#budget") ||
            document.querySelector(".budget-section");

        if (budgetSection) {

            budgetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


/* =====================================================
   SINCRONIZAR CONTA DO FORMULÁRIO
===================================================== */

budgetBill?.addEventListener("input", () => {

    let value = budgetBill.value
        .replace(/[^\d.,]/g, "");

    budgetBill.value = value;

});


/* =====================================================
   MÁSCARA DE TELEFONE
===================================================== */

budgetPhone?.addEventListener("input", () => {

    let value = budgetPhone.value.replace(/\D/g, "");

    if (value.length > 11) {
        value = value.substring(0, 11);
    }

    if (value.length <= 10) {

        value = value.replace(
            /^(\d{2})(\d{4})(\d{0,4}).*/,
            "($1) $2-$3"
        );

    } else {

        value = value.replace(
            /^(\d{2})(\d{5})(\d{0,4}).*/,
            "($1) $2-$3"
        );

    }

    budgetPhone.value = value;

});


/* =====================================================
   ENVIAR ORÇAMENTO PARA WHATSAPP
===================================================== */

budgetForm?.addEventListener("submit", (event) => {

    event.preventDefault();


    const name =
        budgetName?.value.trim() || "";

    const phone =
        budgetPhone?.value.trim() || "";

    const email =
        budgetEmail?.value.trim() || "";

    const bill =
        budgetBill?.value.trim() || "";

    const property =
        budgetProperty?.value || "";

    const message =
        budgetMessage?.value.trim() || "";


    /* Validação */

    if (!name) {
        alert("Por favor, informe seu nome.");
        budgetName?.focus();
        return;
    }

    if (!phone) {
        alert("Por favor, informe seu WhatsApp.");
        budgetPhone?.focus();
        return;
    }

    if (!bill) {
        alert("Por favor, informe o valor da sua conta de energia.");
        budgetBill?.focus();
        return;
    }


    /* Número do WhatsApp da empresa */

    const whatsappNumber = "5511999999999";


    /* Montar mensagem */

    let whatsappMessage =
`Olá! Gostaria de solicitar um orçamento de energia solar.

*Dados do cliente*
Nome: ${name}
WhatsApp: ${phone}
E-mail: ${email || "Não informado"}

*Dados da simulação*
Conta de energia: R$ ${bill}
Tipo de imóvel: ${property || "Não informado"}

${message || "Gostaria de receber um orçamento."}`;


    /* Adicionar dados calculados */

    if (window.solarSimulation) {

        const data = window.solarSimulation;

        whatsappMessage += `

*Estimativa do sistema*
Sistema: ${data.system.toFixed(1).replace(".", ",")} kWp
Painéis: ${data.panels}
Economia mensal: ${formatCurrency(data.saving)}
Economia anual: ${formatCurrency(data.annual)}
Redução estimada: ${data.reduction}%`;
    }


    /* Abrir WhatsApp */

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            whatsappMessage
        )}`;


    window.open(
        whatsappURL,
        "_blank"
    );

});


/* =====================================================
   ENVIAR ORÇAMENTO POR E-MAIL
===================================================== */

budgetEmailButton?.addEventListener("click", () => {

    const name =
        budgetName?.value.trim() || "";

    const phone =
        budgetPhone?.value.trim() || "";

    const email =
        budgetEmail?.value.trim() || "";

    const bill =
        budgetBill?.value.trim() || "";

    const property =
        budgetProperty?.value || "";

    const message =
        budgetMessage?.value.trim() || "";


    /* Validação */

    if (!name) {
        alert("Por favor, informe seu nome.");
        budgetName?.focus();
        return;
    }

    if (!bill) {
        alert("Por favor, informe o valor da sua conta de energia.");
        budgetBill?.focus();
        return;
    }


    /* E-mail da empresa */

    const companyEmail = "contato@empresasolar.com.br";


    /* Montar corpo do e-mail */

    let emailBody =
`Olá! Gostaria de solicitar um orçamento de energia solar.

Dados do cliente
Nome: ${name}
WhatsApp: ${phone || "Não informado"}
E-mail: ${email || "Não informado"}

Dados da simulação
Conta de energia: R$ ${bill}
Tipo de imóvel: ${property || "Não informado"}

${message || "Gostaria de receber um orçamento."}`;


    if (window.solarSimulation) {

        const data = window.solarSimulation;

        emailBody += `

Estimativa do sistema
Sistema: ${data.system.toFixed(1).replace(".", ",")} kWp
Painéis: ${data.panels}
Economia mensal: ${formatCurrency(data.saving)}
Economia anual: ${formatCurrency(data.annual)}
Redução estimada: ${data.reduction}%`;
    }


    const subject =
        encodeURIComponent("Orçamento de energia solar");

    const body =
        encodeURIComponent(emailBody);

    const mailtoURL =
        `mailto:${companyEmail}?subject=${subject}&body=${body}`;

    window.location.href = mailtoURL;

});


/* =====================================================
   BOTÃO WHATSAPP DA SIMULAÇÃO
===================================================== */

const simulationWhatsappButton =
    document.querySelector(
        ".whatsapp-simulation-button"
    );

simulationWhatsappButton?.addEventListener(
    "click",
    () => {

        updateCalculator();

        const data = window.solarSimulation;

        if (!data) return;


        const whatsappNumber =
            "5511999999999";


        const message =
`Olá! Fiz uma simulação de energia solar no site e gostaria de receber mais informações.

*Minha simulação:*

Conta atual: ${formatCurrency(data.bill)}
Economia mensal estimada: ${formatCurrency(data.saving)}
Economia anual estimada: ${formatCurrency(data.annual)}
Sistema estimado: ${data.system.toFixed(1).replace(".", ",")} kWp
Painéis estimados: ${data.panels}
Redução estimada: ${data.reduction}%
Tipo de imóvel: ${data.property}

Gostaria de receber um orçamento.`;

        const url =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                message
            )}`;

        window.open(url, "_blank");

    }
);


/* =====================================================
   LINKS INTERNOS
===================================================== */

document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

        const targetId =
            link.getAttribute("href");

        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }

        const target =
            document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        /* Fechar menu mobile */

        nav?.classList.remove("mobile-active");

    });

});


/* =====================================================
   ANIMAÇÃO DE NÚMEROS
===================================================== */

function animateNumber(
    element,
    target,
    duration = 1200
) {

    if (!element) return;

    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {

        const progress =
            Math.min(
                (currentTime - startTime) / duration,
                1
            );

        const eased =
            1 - Math.pow(1 - progress, 3);

        const current =
            start + (target - start) * eased;

        element.textContent =
            Math.round(current).toLocaleString(
                "pt-BR"
            );

        if (progress < 1) {
            requestAnimationFrame(update);
        }

    }

    requestAnimationFrame(update);
}


/* =====================================================
   OBSERVADOR DOS NÚMEROS
===================================================== */

const stats =
    document.querySelectorAll(".stat strong");

const statsObserver =
    new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                const element =
                    entry.target;

                const text =
                    element.textContent;

                const number =
                    parseFloat(
                        text.replace(/[^\d.]/g, "")
                    );

                if (!isNaN(number)) {

                    animateNumber(
                        element,
                        number
                    );

                }

                observer.unobserve(element);

            });

        },
        {
            threshold: 0.5
        }
    );


stats.forEach((stat) => {
    statsObserver.observe(stat);
});


/* =====================================================
   PROTEÇÃO CONTRA FORMULÁRIO VAZIO
===================================================== */

document.querySelectorAll("form").forEach((form) => {

    form.addEventListener("submit", (event) => {

        if (form === budgetForm) {
            return;
        }

        const requiredFields =
            form.querySelectorAll(
                "[required]"
            );

        let valid = true;

        requiredFields.forEach((field) => {

            if (!field.value.trim()) {

                valid = false;

                field.focus();

            }

        });

        if (!valid) {
            event.preventDefault();
        }

    });

});


/* =====================================================
   ATUALIZAÇÃO FINAL
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCalculator();

        /* Define residencial como padrão */

        const activeProperty =
            document.querySelector(
                ".property-option.active"
            );

        if (activeProperty) {

            selectedProperty =
                activeProperty.dataset.property ||
                activeProperty.dataset.type ||
                "residencial";

        }

        updateCalculator();

    }
);


/* =====================================================
   LUMENS — ASSISTENTE VIRTUAL
===================================================== */

const lumensButton = document.querySelector("#lumensButton");
const lumensPanel = document.querySelector("#lumensPanel");
const lumensClose = document.querySelector("#lumensClose");
const lumensGreeting = document.querySelector("#lumensGreeting");
const lumensGreetingClose = document.querySelector("#lumensGreetingClose");
const lumensMessages = document.querySelector("#lumensMessages");
const lumensQuickReplies = document.querySelector("#lumensQuickReplies");
const lumensForm = document.querySelector("#lumensForm");
const lumensInput = document.querySelector("#lumensInput");


/* Base de respostas do Lumens (versão simples, sem IA externa) */

const lumensKnowledge = [
    {
        id: "instalacao",
        keywords: ["instala", "tempo", "dias", "demora"],
        answer:
            "A instalação geralmente leva de 1 a 3 dias, dependendo do " +
            "tamanho do sistema e do tipo de telhado. 🔧"
    },
    {
        id: "economia",
        keywords: ["economia", "economizar", "reduzir", "desconto"],
        answer:
            "A economia pode chegar a até 90% da sua conta de energia! " +
            "Usa o simulador ali em cima pra ver uma estimativa com base " +
            "no seu consumo. ⚡"
    },
    {
        id: "manutencao",
        keywords: ["manuten", "limpeza", "cuidado"],
        answer:
            "A manutenção é simples: limpeza periódica dos painéis e " +
            "inspeções visuais. Nossa equipe te orienta na periodicidade " +
            "ideal pro seu caso. 🧹"
    },
    {
        id: "orcamento",
        keywords: ["orçamento", "orcamento", "preço", "preco", "valor", "custa", "contratar"],
        answer:
            "Você pode pedir um orçamento personalizado na seção " +
            "'Orçamento' — é rapidinho e já vem preenchido com os dados " +
            "da sua simulação! 📋"
    },
    {
        id: "nublado",
        keywords: ["nublado", "noite", "chuva", "sol"],
        answer:
            "Em dias nublados o sistema continua gerando energia, só " +
            "que com produção reduzida. À noite, sua casa usa energia " +
            "da rede, seguindo o sistema de compensação. ☁️"
    },
    {
        id: "garantia",
        keywords: ["garantia", "durabilidade", "vida útil", "vida util"],
        answer:
            "Os painéis e inversores têm garantia de fábrica, que varia " +
            "por fabricante — os detalhes vêm junto com o seu " +
            "orçamento. ✅"
    },
    {
        id: "retorno",
        keywords: ["retorno", "payback", "vale a pena", "investimento"],
        answer:
            "O retorno do investimento costuma ficar entre 3 e 6 anos, " +
            "dependendo do consumo e do tamanho do sistema. Depois " +
            "disso, é economia praticamente pura! 💰"
    }
];

const lumensFallback =
    "Boa pergunta! Essa eu ainda não sei responder direito 😅 Mas dá " +
    "pra falar direto com a nossa equipe pelo formulário de orçamento, " +
    "que é rapidinho!";


function openLumensPanel() {
    lumensPanel?.classList.add("open");
    lumensGreeting?.classList.add("hidden");
}

function closeLumensPanel() {
    lumensPanel?.classList.remove("open");
}

lumensButton?.addEventListener("click", () => {

    if (lumensPanel?.classList.contains("open")) {
        closeLumensPanel();
    } else {
        openLumensPanel();
    }

});

lumensClose?.addEventListener("click", closeLumensPanel);

lumensGreetingClose?.addEventListener("click", (event) => {
    event.stopPropagation();
    lumensGreeting?.classList.add("hidden");
});

lumensGreeting?.addEventListener("click", openLumensPanel);


function addLumensMessage(text, sender) {

    if (!lumensMessages) return;

    const bubble = document.createElement("div");

    bubble.className = `lumens-message ${sender}`;
    bubble.textContent = text;

    lumensMessages.appendChild(bubble);

    lumensMessages.scrollTop = lumensMessages.scrollHeight;
}


function answerLumens(query) {

    const normalized = query.toLowerCase();

    const match = lumensKnowledge.find((item) =>
        item.keywords.some((keyword) => normalized.includes(keyword))
    );

    const answer = match ? match.answer : lumensFallback;

    setTimeout(() => {
        addLumensMessage(answer, "bot");
    }, 350);
}


lumensQuickReplies?.querySelectorAll("button").forEach((button) => {

    button.addEventListener("click", () => {

        const id = button.dataset.q;

        const item = lumensKnowledge.find((entry) => entry.id === id);

        addLumensMessage(button.textContent.trim(), "user");

        setTimeout(() => {
            addLumensMessage(item ? item.answer : lumensFallback, "bot");
        }, 350);

    });

});


/* =====================================================
   LUMENS — ENVIO DE MENSAGEM (modo simples, por palavras-chave)
===================================================== */

lumensForm?.addEventListener("submit", (event) => {

    event.preventDefault();

    const value = lumensInput?.value.trim();

    if (!value) return;

    addLumensMessage(value, "user");

    lumensInput.value = "";

    answerLumens(value);

});
