// Función autoinvocada para el uso del patrón módulo.
// Sirve para limitar el scope de nuestra app, para que no se pueda acceder facilmente desde la consola.
const miModulo = (() => {
    'use strict'

    // Variables globales
    let deck = [];
    const tipos      = ['C','D','H','S'], 
          especiales = ['A','J','Q','K'];

    // let puntosJugador = 0,
    //     puntosComputadora = 0;
    let puntosJugadores = [];

    // REFERENCIAS DEL HTML
    // botones
    const btnPedir   = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo   = document.querySelector('#btnNuevo');

    // cartas
    const cartasJugadores  = document.querySelectorAll('.divCartas'),
          contadorPuntos = document.querySelectorAll('small');
    // puntaje


    // Esta función inicializa el juego.
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        contadorPuntos.forEach(element => element.innerText = 0);
        cartasJugadores.forEach(element => element.innerHTML='');

        btnPedir.disabled   = false;
        btnDetener.disabled = false;
    }

    // Esta función permite crear un nuevo deck barajado.
    const crearDeck = () => {

        deck = [];   
        for(let i = 2; i <= 10; i++){
            for (let tipo of tipos) {
                deck.push(i + tipo);   
            }
        }    

        for (let tipo of tipos) {
            for (let especial of especiales) {
                deck.push(especial + tipo);
            }        
        }
        return _.shuffle(deck);
    }

    // Esta función permite pedir una carta
    const pedirCarta = () => {

        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }

    // Esta función permite obtener el valor de la carta
    const valorCarta = ( carta ) => {
        const valor = carta.substring(0,carta.length-1);
        return (isNaN( valor )) ? 
                ( valor === 'A' ) ? 11 : 10 
                : valor * 1;
    }

    // Turno 0 = 1er Jugador / Turno 1 = Computadora
    const acumularPuntos = ( carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        contadorPuntos[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];

    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        cartasJugadores[turno].append(imgCarta);
    }

    const determinarGanador = () => {

        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {

            if (puntosComputadora === puntosMinimos) {
                alert('¡Ha habido empate! Juega denuevo para el desempate.');
            } else if (puntosMinimos > 21) {
                alert('Computadora gana :(');
            } else if (puntosComputadora > 21){
                alert('¡Enhorabuena! ¡Has ganado!');
            }
            else {
                alert('Computadora gana :(');
            }
            
        }, 200);
    }

    // Turno de la computadora
    const turnoComputadora = ( puntosMinimos ) => {

        let puntosComputadora = 0;

        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length-1);   
            crearCarta(carta, puntosJugadores.length-1);

        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();

    }

    // Eventos
    // Esta configuración permite solicitar cartas, obtener puntaje y controlar turnos.
    btnPedir.addEventListener('click', () => {
        
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            console.warn('Te has pasado de 21. La computadora gana.');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21){
            console.warn('¡Genial, 21!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });

    // Esta configuración permite detener el turno del jugador1 y darle paso a la computadora
    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0])
    });

    // Set del botón nuevo juego
    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });

    return {
        nuevoJuego: inicializarJuego
    }

})(); // Fin de función autoinvocada
