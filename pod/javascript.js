document.addEventListener('DOMContentLoaded', () => {
    // Adicionar efeito de clique aos botões
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Botão clicado:', button.innerText);
            // Simulação de redirecionamento para checkout
            // window.location.href = "SEU_LINK_DE_CHECKOUT_AQUI";
        });
    });

    // Animação simples de entrada para os elementos da hero
    const heroElements = document.querySelectorAll('.main-title, .subtitle, .hero-grid');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s ease-out';
        el.style.transitionDelay = `${index * 0.2}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
});
