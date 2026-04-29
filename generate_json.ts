
import * as fs from 'fs';

const newVerses = [
  // 1. Ansiedade e Preocupação
  {
    ref: "Filipenses 4:6-7",
    text: "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, com ação de graças, apresentem seus pedidos a Deus. E a paz de Deus, que excede todo o entendimento, guardará os seus corações e as suas mentes.",
    expl: "Às vezes, o peso do amanhã tenta roubar o seu hoje. Respire fundo. Você não precisa carregar o mundo nos ombros. Entregar suas preocupações é um ato de coragem que abre espaço para uma tranquilidade que a lógica não explica.",
    cat: "Ansiedade e Preocupação"
  },
  {
    ref: "1 Pedro 5:7",
    text: "Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.",
    expl: "Imagine que você pode pousar uma mochila pesada no chão. É exatamente isso que esse convite propõe. Você é alvo de um cuidado atento e constante. Não guarde o aperto no peito só para você; compartilhe o fardo.",
    cat: "Ansiedade e Preocupação"
  },
  {
    ref: "Mateus 6:34",
    text: "Portanto, não se preocupem com o amanhã, pois o amanhã trará as suas próprias preocupações. Basta a cada dia o seu próprio mal.",
    expl: "O futuro é um horizonte que ainda não chegou, então por que sofrer por ele agora? Foque na sua respiração neste exato momento. Cada dia tem sua própria medida de força e de desafios.",
    cat: "Ansiedade e Preocupação"
  },
  {
    ref: "Salmos 94:19",
    text: "Quando a ansiedade já dominava o meu íntimo, o teu consolo trouxe alívio à minha alma.",
    expl: "Existem dias em que os pensamentos parecem um mar revolto. Nessas horas, procure o ancoradouro. O consolo não apaga o problema imediatamente, mas envolve o seu coração em uma camada de proteção.",
    cat: "Ansiedade e Preocupação"
  },
  {
    ref: "Salmos 55:22",
    text: "Entregue suas preocupações ao Senhor, e ele o susterá; jamais permitirá que o justo venha a cair.",
    expl: "A sensação de queda livre termina quando você decide confiar em um apoio maior. Você não será deixado à própria sorte. Existe um sustento invisível, mas real, que mantém seus pés firmes.",
    cat: "Ansiedade e Preocupação"
  },
  {
    ref: "João 14:27",
    text: "Deixo-lhes a paz; a minha paz lhes dou. Não a dou como o mundo a dá. Não se perturbem os seus corações, nem tenham medo.",
    expl: "A paz que o mundo oferece depende de tudo estar bem do lado de fora. A paz proposta aqui nasce de dentro para fora. É uma serenidade que permanece mesmo em meio ao barulho.",
    cat: "Ansiedade e Preocupação"
  },
  {
    ref: "Mateus 11:28",
    text: "Venham a mim, todos os que estão cansados e sobrecarregados, e eu lhes darei descanso.",
    expl: "Este é um convite para o repouso verdadeiro. Se o cansaço mental te exauriu, pare um pouco. Não é sobre fazer mais, é sobre ser acolhido. Existe um lugar de repouso onde suas forças são renovadas.",
    cat: "Ansiedade e Preocupação"
  },
  {
    ref: "Salmos 37:5",
    text: "Entregue o seu caminho ao Senhor; confie nele, e ele agirá.",
    expl: "Muitas vezes sofremos tentando controlar o incontrolável. Abrir mão do controle não é desistir, é confiar o roteiro a quem conhece o destino final. Quando você solta as rédeas, a vida flui melhor.",
    cat: "Ansiedade e Preocupação"
  },
  {
    ref: "Isaías 26:3",
    text: "Tu guardarás em perfeita paz aquele cujo propósito está firme, porque em ti confia.",
    expl: "A estabilidade emocional vem de onde depositamos nossa confiança. Quando decidimos acreditar que o melhor está sendo preparado, a mente para de oscilar. Essa paz perfeita é como um escudo.",
    cat: "Ansiedade e Preocupação"
  },
  {
    ref: "Salmos 46:10",
    text: "Aquietem-se e saibam que eu sou Deus.",
    expl: "No meio do caos, o maior poder está no silêncio. Pare de lutar por um instante. Aquietar-se é reconhecer que existe uma inteligência maior regendo a existência.",
    cat: "Ansiedade e Preocupação"
  },
  // 2. Medo e Insegurança
  {
    ref: "Isaías 41:10",
    text: "Não tema, pois estou com você; não tenha medo, pois sou o seu Deus. Eu o fortalecerei e o ajudarei.",
    expl: "O medo tenta nos isolar, mas você nunca está realmente sozinho. Há uma presença invisível que caminha ao seu lado, oferecendo uma mão firme quando suas pernas fraquejam.",
    cat: "Medo e Insegurança"
  },
  {
    ref: "Salmos 23:4",
    text: "Mesmo quando eu andar por um vale de trevas e morte, não temerei mal algum, pois tu estás comigo.",
    expl: "As fases sombrias da vida são apenas passagens, não destinos finais. Mesmo que a luz pareça distante, a companhia que te guia é constante. Não há motivo para pânico na escuridão.",
    cat: "Medo e Insegurança"
  },
  {
    ref: "2 Timóteo 1:7",
    text: "Pois Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.",
    expl: "A insegurança não faz parte da sua essência real. Você foi dotado de uma capacidade incrível de superação e de uma mente capaz de encontrar o equilíbrio. Resgate essa força interior.",
    cat: "Medo e Insegurança"
  },
  {
    ref: "Salmos 27:1",
    text: "O Senhor é a minha luz e a minha salvaçao; de quem terei medo?",
    expl: "Quando a luz da verdade brilha, as sombras do medo desaparecem. Veja a situação sob uma nova perspectiva. Se você tem clareza sobre quem você é, as ameaças externas perdem o poder.",
    cat: "Medo e Insegurança"
  },
  {
    ref: "Salmos 56:3",
    text: "Mas, quando eu tiver medo, confiarei em ti.",
    expl: "Sentir medo é humano, mas deixar-se paralisar por ele é uma escolha. No momento em que o frio na barriga surgir, transforme-o em um lembrete para buscar confiança.",
    cat: "Medo e Insegurança"
  },
  {
    ref: "Josué 1:9",
    text: "Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor estará com você por onde você andar.",
    expl: "A coragem não é a ausência de medo, mas a decisão de seguir em frente. Você carrega consigo uma promessa de companhia constante. Não importa para onde a vida te leve, esse suporte estará lá.",
    cat: "Medo e Insegurança"
  },
  {
    ref: "Salmos 34:4",
    text: "Busquei o Senhor, e ele me respondeu; livrou-me de todos os meus medos.",
    expl: "Existe uma saída para o labirinto das preocupações. Ao direcionar seu foco para algo maior e positivo, os nós do peito começam a se desatar. O livramento começa com uma mudança de pensamento.",
    cat: "Medo e Insegurança"
  },
  {
    ref: "Isaías 43:1",
    text: "Não tema, pois eu o resgatei; eu o chamei pelo nome, você é meu.",
    expl: "Você não é apenas um número na multidão. Existe um reconhecimento profundo de quem você é. Saber que você é valorizado e protegido traz uma segurança que ninguém pode tirar.",
    cat: "Medo e Insegurança"
  },
  {
    ref: "Salmos 118:6",
    text: "O Senhor está comigo, não temerei. O que me podem fazer os homens?",
    expl: "A opinião alheia ou as pressões externas diminuem de tamanho quando você percebe a magnitude da proteção que te cerca. Quando seu interior está fundamentado, o externo não te abala.",
    cat: "Medo e Insegurança"
  },
  {
    ref: "Provérbios 3:25-26",
    text: "Não tenha medo do desastre repentino... pois o Senhor será a sua segurança.",
    expl: "Imprevistos acontecem, mas eles não definem o seu fim. Ter uma base sólida significa que, mesmo diante de tempestades, você permanecerá de pé. Sua segurança vem de uma fonte inesgotável.",
    cat: "Medo e Insegurança"
  },
  // 3. Tristeza e Desânimo
  {
    ref: "Salmos 34:18",
    text: "O Senhor está perto dos que têm o coração quebrantado e salva os de espírito abatido.",
    expl: "Nos momentos de maior fragilidade é onde o acolhimento se faz mais presente. Se você se sente em pedaços, saiba que há uma força que te envolve com delicadeza. A tristeza é um convite ao cuidado.",
    cat: "Tristeza e Desânimo"
  },
  {
    ref: "Salmos 126:5",
    text: "Aqueles que semeiam com lágrimas, com cantos de alegria colherão.",
    expl: "O choro pode durar uma noite, mas ele também prepara o terreno para novos sorrisos. Cada lágrima que cai é como uma semente de resiliência. O ciclo da dor vai passar e dar lugar à satisfação.",
    cat: "Tristeza e Desânimo"
  },
  {
    ref: "Mateus 5:4",
    text: "Bem-aventurados os que choram, pois serão consolados.",
    expl: "Existe uma promessa de alívio para a sua dor. Não tente reprimir o que sente; o consolo vem justamente para quem reconhece a necessidade de ser acolhido. Esse toque na alma trará esperança.",
    cat: "Tristeza e Desânimo"
  },
  {
    ref: "Salmos 30:5",
    text: "O choro pode persistir uma noite, mas a alegria vem pela manhã.",
    expl: "A escuridão do desânimo tem hora para acabar. Assim como o sol sempre nasce após a noite mais densa, a sua alegria também retornará. Mantenha a chama da esperança acesa.",
    cat: "Tristeza e Desânimo"
  },
  {
    ref: "Isaías 40:31",
    text: "Mas aqueles que esperam no Senhor renovam as suas forças. Voam alto como águias; correm e não se fatigam.",
    expl: "O desânimo é apenas um esgotamento temporário das suas reservas. Ao descansar em algo positivo e eterno, você recarrega suas energias para alçar voos novamente com disposição renovada.",
    cat: "Tristeza e Desânimo"
  },
  {
    ref: "Salmos 147:3",
    text: "Ele cura os que têm o coração quebrantado e cuida das suas feridas.",
    expl: "As feridas da alma levam tempo para fechar, mas existe um processo de cura em curso. Cada dor está sendo tratada com paciência e amor. Permita que esse cuidado suave restaure sua alegria.",
    cat: "Tristeza e Desânimo"
  },
  {
    ref: "Apocalipse 21:4",
    text: "Ele enxugará dos seus olhos toda lágrima. Não haverá mais morte, nem tristeza, nem choro, nem dor.",
    expl: "Existe a visão de um estado de paz onde o sofrimento não tem lugar. Deixe que essa esperança de um futuro sereno ilumine seu presente. Saiba que a dor atual não é eterna.",
    cat: "Tristeza e Desânimo"
  },
  {
    ref: "Salmos 42:11",
    text: "Por que você está assim tão abatida, ó minha alma? Por que se perturba dentro de mim? Coloque a sua esperança em Deus.",
    expl: "Às vezes precisamos conversar com o nosso próprio interior. Questione sua tristeza, mas ofereça a ela um remédio: a esperança. Mudar o foco para a solução traz um alívio imediato.",
    cat: "Tristeza e Desânimo"
  },
  {
    ref: "Neemias 8:10",
    text: "Não se entristeçam, porque a alegria do Senhor é a sua força.",
    expl: "A alegria genuína não depende de fatos externos; ela é uma força que vem de dentro e te sustenta. Mesmo quando tudo parecer cinza, busque essa centelha interna para vencer o dia com dignidade.",
    cat: "Tristeza e Desânimo"
  },
  {
    ref: "João 16:22",
    text: "Assim acontece com vocês: agora é hora de tristeza, mas eu os verei outra vez, e vocês se alegrarão.",
    expl: "O momento atual de dor é passageiro, mas a alegria que está por vir será sólida. Ninguém tem o poder de roubar a paz que você conquista internamente. Aguente firme, tempos melhores virão.",
    cat: "Tristeza e Desânimo"
  },
  // 4. Solidão e Abandono
  {
    ref: "Salmos 27:10",
    text: "Ainda que me abandonem pai e mãe, o Senhor me acolherá.",
    expl: "Mesmo que as pessoas mais próximas falhem, existe um acolhimento que nunca falha. Você nunca será órfão de afeto ou proteção. Sinta o abraço invisível que te envolve agora; você é amado.",
    cat: "Solidão e Abandono"
  },
  {
    ref: "Mateus 28:20",
    text: "E eu estarei sempre com vocês, até o fim dos tempos.",
    expl: "A solidão é uma sensação, não necessariamente um fato. Há uma presença constante que preenche todos os espaços vazios da sua vida. Você não caminha sozinho em nenhum segundo do dia.",
    cat: "Solidão e Abandono"
  },
  {
    ref: "Hebreus 13:5",
    text: "Nunca o deixarei, nunca o abandonarei.",
    expl: "Essa é uma promessa de fidelidade absoluta. Quando o silêncio da casa parecer ensurdecedor, lembre-se dessas palavras. Não há distância que te afaste desse cuidado constante e amparador.",
    cat: "Solidão e Abandono"
  },
  {
    ref: "Isaías 49:15",
    text: "Pode uma mãe esquecer-se do filho que ainda mama? Ainda que ela se esqueça, eu não me esquecerei de você.",
    expl: "O amor mais forte do mundo físico é usado aqui para mostrar que o cuidado divino é ainda maior. Você está gravado na memória de quem criou as estrelas. Seu nome é lembrado e sua vida é preciosa.",
    cat: "Solidão e Abandono"
  },
  {
    ref: "Deuteronômio 31:8",
    text: "O Senhor irá à sua frente e estará com você; ele nunca o deixará. Não tenha medo!",
    expl: "Você não está abrindo caminho sozinho. Há alguém que vai adiante, preparando o terreno e removendo obstáculos. A companhia é garantida tanto no trajeto quanto no destino. Sinta-se seguro.",
    cat: "Solidão e Abandono"
  },
  {
    ref: "Salmos 68:6",
    text: "Deus faz que o solitário viva em família.",
    expl: "A solidão não é o seu estado permanente. Existem conexões, afetos e comunidades esperando por você. Abra-se para as novas amizades; o universo conspira para que você encontre seu lugar.",
    cat: "Solidão e Abandono"
  },
  {
    ref: "João 14:18",
    text: "Não os deixarei órfãos; voltarei para vocês.",
    expl: "O sentimento de estar perdido sem direção acaba quando você percebe que o auxílio está a caminho. O amparo emocional e espiritual é uma realidade pronta para ser acessada a qualquer momento.",
    cat: "Solidão e Abandono"
  },
  {
    ref: "Romanos 8:38-39",
    text: "Pois estou convencido de que nem a morte nem a vida... nem qualquer outra coisa será capaz de nos separar do amor de Deus.",
    expl: "Não existe força no universo capaz de cortar o vínculo de amor que te sustenta. Esse laço é indestrutível. Quando se sentir sozinho, lembre-se que você está mergulhado em um oceano de carinho.",
    cat: "Solidão e Abandono"
  },
  {
    ref: "Salmos 139:7",
    text: "Para onde poderia eu escapar do teu Espírito? Para onde poderia fugir da tua presença?",
    expl: "Não há lugar onde você possa estar que a luz da paz não te alcance. Mesmo nos momentos de isolamento voluntário, o cuidado te acompanha. Essa onipresença é o maior conforto que existe.",
    cat: "Solidão e Abandono"
  },
  {
    ref: "Gênesis 28:15",
    text: "Estou com você e cuidarei de você por onde quer que vá... não o deixarei.",
    expl: "Leve essa certeza no seu bolso: você é vigiado com carinho em cada passo. Não importa se o lugar é desconhecido, o manto de proteção é o mesmo. A solidão se dissipa no acompanhamento eterno.",
    cat: "Solidão e Abandono"
  },
  // 5. Cansaço e Esgotamento
  {
    ref: "Isaías 40:29",
    text: "Ele dá força ao cansado e aumenta o vigor do que está sem forças.",
    expl: "Quando você sente que chegou ao limite, é o momento de receber uma energia que não vem de você. Existe uma fonte de renovação disponível para quem admite que não pode mais. Deixe-se recarregar.",
    cat: "Cansaço e Esgotamento"
  },
  {
    ref: "Salmos 127:2",
    text: "Será inútil levantar cedo e dormir tarde, trabalhando arduamente... pois ele concede o sono aos seus amados.",
    expl: "O descanso é um presente, não um luxo. Pare de se cobrar tanto. O mundo não vai parar se você tirar um tempo para recompor suas energias e ter uma noite de sono tranquilo.",
    cat: "Cansaço e Esgotamento"
  },
  {
    ref: "Mateus 11:29",
    text: "Tomem sobre vocês o meu jugo e aprendam de mim... e vocês encontrarão descanso para as suas almas.",
    expl: "O esgotamento muitas vezes vem de carregar pesos que não são nossos. Aprenda a arte da leveza. Existe um jeito de caminhar que não consome todas as suas forças. Troque a pressa pela pausa.",
    cat: "Cansaço e Esgotamento"
  },
  {
    ref: "Salmos 62:1",
    text: "A minha alma descansa somente em Deus; dele vem a minha salvação.",
    expl: "Procure o silêncio. No barulho das obrigações, a alma se cansa. O verdadeiro repouso acontece quando paramos de lutar e apenas 'somos'. Encontre esse ponto de paz e sinta a tensão se dissolver.",
    cat: "Cansaço e Esgotamento"
  },
  {
    ref: "Gálatas 6:9",
    text: "E não nos cansemos de fazer o bem, pois no tempo próprio colheremos, se não desanimarmos.",
    expl: "O cansaço do fazer é real, mas o propósito por trás dele sustenta a caminhada. Se você está esgotado de tentar, faça uma pausa, mas não desista. O resultado do seu esforço aparecerá no tempo certo.",
    cat: "Cansaço e Esgotamento"
  },
  {
    ref: "Salmos 23:2",
    text: "Em verdes pastagens me faz repousar e me conduz a águas tranquilas.",
    expl: "Visualize um lugar de paz absoluta, onde o único som é o da natureza. É para esse estado mental que você está sendo convidado. Deixe que as águas calmas da paciência lavem o seu esgotamento.",
    cat: "Cansaço e Esgotamento"
  },
  {
    ref: "1 Reis 19:7",
    text: "Levante-se e coma, pois a jornada será muito longa para você.",
    expl: "Às vezes, a espiritualidade profunda está em cuidar do corpo. Coma bem, durma, respire. Reconheça seus limites humanos. É preciso estar nutrido para continuar a caminhada sem erro.",
    cat: "Cansaço e Esgotamento"
  },
  {
    ref: "Salmos 4:8",
    text: "Em paz me deito e logo adormeço, pois só tu, Senhor, me fazes viver em segurança.",
    expl: "A insônia do esgotamento termina quando a confiança assume o lugar da preocupação. Solte os problemas na hora de deitar; eles podem ser resolvidos amanhã. Agora, seu dever é o silêncio renovador.",
    cat: "Cansaço e Esgotamento"
  },
  {
    ref: "Êxodo 33:14",
    text: "A minha presença irá com você, e eu lhe darei descanso.",
    expl: "A jornada não precisa ser exaustiva quando se tem a companhia certa. O descanso prometido aqui é interno: uma calma que te segue durante as atividades e evita que você se sinta sobrecarregado.",
    cat: "Cansaço e Esgotamento"
  },
  {
    ref: "Salmos 116:7",
    text: "Retorne ao seu descanso, ó minha alma, porque o Senhor tem sido bom para você.",
    expl: "Relembre as coisas boas que já aconteceram. Mudar o foco da falta para a gratidão é o atalho mais rápido para o alívio do cansaço mental. Deixe sua alma voltar ao seu estado de equilíbrio confiante.",
    cat: "Cansaço e Esgotamento"
  },
  // 6. Perda e Luto
  {
    ref: "João 11:25",
    text: "Disse-lhe Jesus: 'Eu sou a ressurreição e a vida. Aquele que crê em mim, ainda que morra, viverá'.",
    expl: "A morte não é o ponto final, mas uma transição para uma existência de paz plena. Deixe que essa perspectiva traga luz para o vazio da perda. O amor vivido permanece como um laço eterno.",
    cat: "Perda e Luto"
  },
  {
    ref: "Salmos 34:18",
    text: "O Senhor está perto dos que têm o coração quebrantado.",
    expl: "No luto, as palavras muitas vezes falham, mas a presença acolhedora é sentida no silêncio. Não se sinta sozinho na sua dor. Há um amparo que te sustenta quando você não tem forças nem para ficar de pé.",
    cat: "Perda e Luto"
  },
  {
    ref: "1 Tessalonicenses 4:13",
    text: "Irmãos, não queremos que ignorem a verdade... para que não fiquem tristes como os outros, que não têm esperança.",
    expl: "A tristeza da saudade é natural, mas ela pode ser vivida com a esperança do reencontro. Não encare a despedida como um 'adeus', mas como um 'até breve' em um lugar onde a dor não existe mais.",
    cat: "Perda e Luto"
  },
  {
    ref: "Salmos 147:3",
    text: "Ele cura os que têm o coração quebrantado e cuida das suas feridas.",
    expl: "O tempo é um aliado na cicatrização da perda. Permita-se viver cada fase do luto sem pressa. Suas feridas emocionais estão sendo tratadas com delicadeza. Um dia, a lembrança trará sorrisos de volta.",
    cat: "Perda e Luto"
  },
  {
    ref: "Mateus 5:4",
    text: "Bem-aventurados os que choram, pois serão consolados.",
    expl: "Chorar faz parte do processo de limpeza da alma. O consolo prometido é como um bálsamo que acalma o ardor da ausência. Deixe-se consolar pelas boas memórias e pela certeza do amparo em cada suspiro.",
    cat: "Perda e Luto"
  },
  {
    ref: "Isaías 57:1-2",
    text: "O justo é levado para ser poupado do mal. Aqueles que caminham retamente entrarão na paz; acharão descanso.",
    expl: "Às vezes, a partida é um alívio para quem vai, um repouso merecido após as lutas da vida. Encontre conforto na paz inabalável que quem você ama agora desfruta, livre de qualquer sofrimento terreno.",
    cat: "Perda e Luto"
  },
  {
    ref: "Salmos 23:4",
    text: "Mesmo quando eu andar pelo vale da sombra da morte... tu estás comigo.",
    expl: "O luto é esse vale escuro, mas o guia é o mesmo. Você não será deixado à deriva na sua dor. Há uma mão que segura a sua e te conduz através da escuridão até que a luz da aceitação brilhe de novo.",
    cat: "Perda e Luto"
  },
  {
    ref: "2 Coríntios 1:3-4",
    text: "O Pai das misericórdias e o Deus de todo consolo, que nos consola em todas as nossas tribulações.",
    expl: "O consolo que você recebe agora te tornará mais sensível e capaz de ajudar outros no futuro. Mas, por enquanto, apenas receba. Deixe que a misericórdia envolva sua mente, trazendo a serenidade necessária.",
    cat: "Perda e Luto"
  },
  {
    ref: "Salmos 116:15",
    text: "Preciosa é aos olhos do Senhor a morte dos seus santos.",
    expl: "A vida de quem partiu foi importante e valorizada até o último instante. Nada se perde na memória do Criador. Cada detalhe da existência de quem você ama está guardado e honrado. Confie.",
    cat: "Perda e Luto"
  },
  {
    ref: "Romanos 14:8",
    text: "Se vivemos, vivemos para o Senhor; e, se morremos, morremos para o Senhor.",
    expl: "Nossa existência pertence a algo muito maior do que este mundo físico. Estamos todos conectados em um plano de amor que transcende a vida e a morte. Essa união espiritual oferece um conforto silencioso.",
    cat: "Perda e Luto"
  },
  // 7. Gratidão e Alegria
  {
    ref: "Salmos 118:24",
    text: "Este é o dia que o Senhor fez; exultemos e alegremo-nos nele.",
    expl: "Cada manhã é uma página em branco e um presente único. Mesmo que existam desafios, procure um motivo, por menor que seja, para sorrir hoje. A alegria de estar vivo torna a jornada mais colorida.",
    cat: "Gratidão e Alegria"
  },
  {
    ref: "1 Tessalonicenses 5:18",
    text: "Dêem graças em todas as circunstâncias, pois esta é a vontade de Deus.",
    expl: "A gratidão tem o poder de transformar o que temos em suficiente. Quando agradecemos, mudamos nossa frequência para a abundância. Liste três coisas boas hoje e sinta como o seu peito se expande em paz.",
    cat: "Gratidão e Alegria"
  },
  {
    ref: "Salmos 103:2",
    text: "Bendiga ao Senhor a minha alma! Não esqueça nenhuma de suas bênçãos.",
    expl: "Muitas vezes focamos no que falta e esquecemos do que já conquistamos. Faça um exercício de memória: lembre-se de quantos problemas você já superou hoje. A gratidão é o remédio contra a amargura.",
    cat: "Gratidão e Alegria"
  },
  {
    ref: "Filipenses 4:4",
    text: "Alegrem-se sempre no Senhor. Novamente direi: alegrem-se!",
    expl: "A alegria verdadeira é uma decisão interna, não uma reação a eventos externos. Escolha cultivar o bom humor e a leveza. Quando decidimos ser alegres, as dificuldades parecem menores. Irradie essa luz.",
    cat: "Gratidão e Alegria"
  },
  {
    ref: "Salmos 16:11",
    text: "Tu me farás conhecer o caminho da vida, a plena alegria na tua presença.",
    expl: "A plenitude não está no acúmulo de bens, mas na conexão com o sagrado e com o seu próprio ser. Quando você está em harmonia consigo mesmo, a alegria flui naturalmente nos prazeres das pequenas coisas.",
    cat: "Gratidão e Alegria"
  },
  {
    ref: "Salmos 126:3",
    text: "Sim, coisas grandiosas fez o Senhor por nós, por isso estamos alegres.",
    expl: "Reconhecer as vitórias, grandes ou pequenas, é fundamental para manter o ânimo. Celebre seus progressos. A vida é feita de ciclos, e estar atento às conquistas te dá a força necessária para seguir.",
    cat: "Gratidão e Alegria"
  },
  {
    ref: "Tiago 1:17",
    text: "Toda boa dádiva e todo dom perfeito vêm do alto.",
    expl: "Olhe ao seu redor e perceba as belezas gratuitas da vida. Sua inteligência, sua capacidade de amar... tudo isso são presentes. Ao reconhecer a origem dessas dádivas, o sentimento de gratidão acalma o espírito.",
    cat: "Gratidão e Alegria"
  },
  {
    ref: "Salmos 28:7",
    text: "O Senhor é a minha força e o meu escudo; nele o meu coração confia... o meu coração exulta de alegria.",
    expl: "A confiança gera alegria. Quando você para de se preocupar com a proteção e passa a confiar nela, sobra espaço para a felicidade. Deixe que a segurança de ser cuidado ecoe dentro de você com gratidão.",
    cat: "Gratidão e Alegria"
  },
  {
    ref: "Habacuque 3:17-18",
    text: "Mesmo que a figueira não floresça... todavia eu me alegrarei no Senhor.",
    expl: "Essa é a alegria mais poderosa que existe: aquela que permanece mesmo quando as coisas não saem como o planejado. É a certeza de que a sua essência está bem, independente da colheita externa agora.",
    cat: "Gratidão e Alegria"
  },
  {
    ref: "Salmos 37:4",
    text: "Deleite-se no Senhor, e ele atenderá aos desejos do seu coração.",
    expl: "Encontrar prazer na vida espiritual traz como consequência a realização dos seus sonhos mais profundos. Quando você está em paz, seus desejos se alinham com o que é melhor. Aproveite a caminhada.",
    cat: "Gratidão e Alegria"
  },
  // 8. Perdão e Culpa
  {
    ref: "1 João 1:9",
    text: "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar e nos purificar de toda injustiça.",
    expl: "A culpa é um fardo pesado demais para carregar. Quando você reconhece seu erro e decide mudar, o perdão é imediato. Não se torture mais pelo passado; receba essa limpeza emocional e recomece.",
    cat: "Perdão e Culpa"
  },
  {
    ref: "Salmos 103:12",
    text: "Quanto o oriente está longe do ocidente, tanto ele afasta de nós as nossas transgressões.",
    expl: "O perdão real apaga a dívida e joga fora a conta. Se você já se arrependeu, pare de trazer o erro de volta para a sua mente. Viva a liberdade de quem não deve nada; foque agora na beleza do presente.",
    cat: "Perdão e Culpa"
  },
  {
    ref: "Miquéias 7:19",
    text: "Tu lançarás todos os nossos pecados nas profundezas do mar.",
    expl: "Imagine suas falhas sendo mergulhadas no oceano mais profundo, onde ninguém pode alcançá-las. É assim que o perdão funcioná. Sinta o alívio dessa libertação e siga em frente sem o peso de ontem.",
    cat: "Perdão e Culpa"
  },
  {
    ref: "Efésios 4:32",
    text: "Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente.",
    expl: "Perdoar o próximo é, acima de tudo, libertar a si mesmo da prisão da mágoa. Não deixe que o erro de alguém dite a sua felicidade. Ao oferecer compaixão, você abre caminho para que a paz volte ao seu interior.",
    cat: "Perdão e Culpa"
  },
  {
    ref: "Isaías 1:18",
    text: "Embora os seus pecados sejam vermelhos como o escarlate, eles se tornarão brancos como a neve.",
    expl: "Não importa o tamanho da falha, a renovação é sempre possível. A sua essência pode ser restaurada à pureza original. Abrace a oportunidade de recomeçar com uma alma limpa e clara.",
    cat: "Perdão e Culpa"
  },
  {
    ref: "Romanos 8:1",
    text: "Portanto, agora já não há condenação para os que estão em Cristo Jesus.",
    expl: "Pare de se julgar e de se condenar. Se existe um caminho de amor que não te condena, por que você continua sendo o seu próprio carrasco? Aceite o perdão e caminhe sabendo que você é amado.",
    cat: "Perdão e Culpa"
  },
  {
    ref: "Colossenses 3:13",
    text: "Perdoem como o Senhor os perdoou.",
    expl: "O perdão é uma corrente de bem. Receber o alívio de ser desculpado nos dá a força para desculpar os outros. Essa prática mantém as relações saudáveis e a nossa mente livre de venenos emocionais e rancores.",
    cat: "Perdão e Culpa"
  },
  {
    ref: "Salmos 32:1",
    text: "Como é feliz aquele que tem suas transgressões perdoadas e seus pecados apagados!",
    expl: "A verdadeira felicidade começa com uma consciência em paz. Não há riqueza que pague o sono tranquilo de quem se sente reconciliado com a vida. Aproveite essa leveza para viver de forma ética.",
    cat: "Perdão e Culpa"
  },
  {
    ref: "Mateus 6:14",
    text: "Pois, se perdoarem as ofensas uns dos outros, o Pai celestial também lhes perdoará.",
    expl: "O perdão é uma via de mão dupla que traz equilíbrio à nossa mente. Ao abrir mão da vingança, você se coloca em posição de receber o melhor da vida. Deixe o amor ser a regra e a paz será o resultado.",
    cat: "Perdão e Culpa"
  },
  {
    ref: "Lucas 7:47",
    text: "Os seus muitos pecados lhe foram perdoados, pelo que ela amou muito.",
    expl: "Quanto mais entendemos nossa própria necessidade de perdão, mais somos capazes de amar com profundidade. Use sua história para se tornar alguém mais compreensivo e acolhedor. O amor prova o perdão.",
    cat: "Perdão e Culpa"
  },
  // 9. Direção e Decisões
  {
    ref: "Provérbios 3:5-6",
    text: "Confie no Senhor de todo o seu coração... reconheça-o em todos os seus caminhos, e ele endireitará as suas veredas.",
    expl: "Na dúvida sobre qual caminho seguir, silencie o barulho externo e ouça a intuição. Você não precisa ter o mapa completo agora; apenas dê o próximo passo com confiança. A direção certa se revelará naturalmente.",
    cat: "Direção e Decisões"
  },
  {
    ref: "Salmos 119:105",
    text: "A tua palavra é lâmpada que ilumina os meus passos e luz que clareia o meu caminho.",
    expl: "A sabedoria milenar funciona como uma lanterna na escuridão da incerteza. Não tente prever o fim da estrada; foque no chão logo à frente dos seus pés. A clareza virá no momento certo e necessário.",
    cat: "Direção e Decisões"
  },
  {
    ref: "Tiago 1:5",
    text: "Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente.",
    expl: "Você não precisa saber todas as respostas sozinho. Peça clareza mental e serenidade para decidir. A resposta muitas vezes vem através de um conselho ou de uma paz súbita sobre uma escolha específica.",
    cat: "Direção e Decisões"
  },
  {
    ref: "Isaías 30:21",
    text: "Quer você se volte para a direita quer para a esquerda, uma voz atrás de você dirá: 'Este é o caminho; siga-o'.",
    expl: "Existe uma bússola interna pronta para te orientar. Confie na sua percepção e na proteção que te envolve. Quando você busca o bem, a própria vida se encarrega de sussurrar a direção correta na encruzilhada.",
    cat: "Direção e Decisões"
  },
  {
    ref: "Salmos 32:8",
    text: "Eu o instruirei e o ensinarei no caminho que você deve seguir; eu o aconselharei e cuidarei de você.",
    expl: "Você tem um mentor invisível cuidando do seu destino. As decisões difíceis tornam-se simples quando você entende que há um suporte por trás de cada escolha. Não tenha medo de errar, você está sendo guiado.",
    cat: "Direção e Decisões"
  },
  {
    ref: "Salmos 25:9",
    text: "Ele conduz os humildes na justiça e lhes ensina o seu caminho.",
    expl: "A humildade de admitir que precisa de orientação abre as portas para a sabedoria. Quando deixamos o orgulho de lado, as opções tornam-se mais claras e éticas. Siga a voz da consciência até a paz.",
    cat: "Direção e Decisões"
  },
  {
    ref: "Jeremias 29:11",
    text: "'Porque sou eu que conheço os planos que tenho para vocês', diz o Senhor, 'planos de fazê-los prosperar e não de causar dano'.",
    expl: "Mesmo quando o presente parece confuso, existe um plano maior de bem-estar sendo tecido para você. O objetivo final é o seu crescimento e a sua felicidade. Confie no roteiro, mesmo sem entender tudo agora.",
    cat: "Direção e Decisões"
  },
  {
    ref: "Salmos 37:23",
    text: "O Senhor firma os passos de um homem quando a conduta deste o agrada.",
    expl: "Se as suas intenções são boas, os seus passos serão firmes. Não se preocupe tanto com os tropeços eventuais; o importante é a direção geral da sua vida. Você está sendo sustentado com estabilidade.",
    cat: "Direção e Decisões"
  },
  {
    ref: "João 16:13",
    text: "Mas, quando o Espírito da verdade vier, ele os guiará a toda a verdade.",
    expl: "A verdade tem um brilho próprio que dissipa a confusão das mentiras ou ilusões. Busque ser autêntico e honesto, e a realidade se mostrará a você de forma nítida. A clareza é o prêmio de um coração sincero.",
    cat: "Direção e Decisões"
  },
  {
    ref: "Salmos 143:8",
    text: "Faze-me ouvir do teu amor leal pela manhã... mostra-me o caminho que devo seguir.",
    expl: "Comece o seu dia buscando inspiração e calma. Ao se conectar com o amor e a gratidão logo cedo, a sua mente fica afiada para tomar as melhores decisões ao longo de todo o dia com novas perspectivas.",
    cat: "Direção e Decisões"
  },
  // 10. Proteção e Provisão
  {
    ref: "Salmos 91:1",
    text: "Aquele que habita no abrigo do Altíssimo e descansa à sombra do Todo-poderoso pode dizer ao Senhor: 'Tu és o meu refúgio'.",
    expl: "Existe um lugar de segurança absoluta dentro de você. Quando o mundo lá fora parecer perigoso ou instável, recolha-se nesse abrigo espiritual. Nada pode atingir a sua paz essencial sob essa proteção maior.",
    cat: "Proteção e Provisão"
  },
  {
    ref: "Filipenses 4:19",
    text: "O meu Deus suprirá todas as necessidades de vocês, de acordo com as suas gloriosas riquezas.",
    expl: "Não tema a falta. O universo é abundante e existe provisão para o que você realmente precisa. Mantenha a fé e o trabalho, confiando que o sustento, material e emocional, chegará no tempo certo.",
    cat: "Proteção e Provisão"
  },
  {
    ref: "Salmos 121:1-2",
    text: "Levanto os meus olhos para os montes; de onde vem o meu socorro? O meu socorro vem do Senhor.",
    expl: "Quando se sentir pequeno diante dos problemas, olhe para o alto, para a grandeza da criação. A mesma força que sustenta o universo está disponível para te ajudar. Seu socorro não falha e está sempre a postos.",
    cat: "Proteção e Provisão"
  },
  {
    ref: "Mateus 6:26",
    text: "Observem as aves do céu... o Pai celestial as alimenta. Não têm vocês muito mais valor do que elas?",
    expl: "Se a natureza é cuidada com tanto detalhe, por que você seria esquecido? Você é uma parte preciosa da existência. Livre-se da angústia da escassez; há um fluxo de provisão constante destinado ao seu bem-estar.",
    cat: "Proteção e Provisão"
  },
  {
    ref: "Salmos 34:7",
    text: "O anjo do Senhor é sentinela ao redor daqueles que o temem, e os livra.",
    expl: "Visualize uma barreira de proteção ao seu redor. Você não está exposto; há uma guarda invisível zelando por cada passo seu. Sinta-se seguro para ir e vir, sabendo que o perigo é afastado de você.",
    cat: "Proteção e Provisão"
  },
  {
    ref: "Salmos 23:1",
    text: "O Senhor é o meu pastor; de nada terei falta.",
    expl: "Essa é a afirmação máxima de confiança na provisão. Ter um guia significa que todas as suas necessidades básicas de alimento, descanso e direção serão atendidas. Descanse na certeza de que o essencial nunca faltará.",
    cat: "Proteção e Provisão"
  },
  {
    ref: "Isaías 54:17",
    text: "Nenhuma arma forjada contra você prevalecerá.",
    expl: "As negatividades ou problemas externos não têm poder definitivo sobre a sua vida. Você é blindado por um propósito maior. Mantenha sua integridade e as dificuldades se dissiparão sem causar danos permanentes.",
    cat: "Proteção e Provisão"
  },
  {
    ref: "Salmos 46:1",
    text: "Deus é o nosso refúgio e a nossa fortaleza, auxílio sempre presente na adversidade.",
    expl: "Não é um auxílio que demora a chegar, é um auxílio que já está presente. No momento exato do desafio, a força para enfrentá-lo surge dentro de você. Você é mais resiliente do que imagina sob essa base indestrutível.",
    cat: "Proteção e Provisão"
  },
  {
    ref: "Mateus 7:7",
    text: "Peçam, e lhes será dado; busquem, e encontrarão; batam, e a porta lhes será aberta.",
    expl: "O universo responde à sua busca sincera. Não hesite em pedir ajuda ou procurar soluções. As portas da oportunidade estão prontas para se abrir diante da sua persistência e fé. A abundância é um direito seu.",
    cat: "Proteção e Provisão"
  },
  {
    ref: "Salmos 138:7",
    text: "Embora eu esteja em meio a grandes aflições, tu preservas a minha vida.",
    expl: "A tempestade pode ser forte, mas o seu barco não afundará. Existe uma preservação especial sobre você que te mantém intacto mesmo sob pressão. Respire com calma, você sairá dessa mais forte e protegido.",
    cat: "Proteção e Provisão"
  }
];

const categoriesTags: Record<string, string[]> = {
  "Ansiedade e Preocupação": ["Ansiedade", "Preocupação", "Inquietude", "Inquieto", "Nervoso"],
  "Medo e Insegurança": ["Medo", "Insegurança", "Receio", "Temor", "Pânico"],
  "Tristeza e Desânimo": ["Tristeza", "Desânimo", "Abatimento", "Choro", "Triste", "Infeliz"],
  "Solidão e Abandono": ["Solidão", "Abandono", "Vazio", "Rejeição", "Sozinho"],
  "Cansaço e Esgotamento": ["Cansaço", "Esgotamento", "Fadiga", "Esgotado", "Exausto", "Sem força"],
  "Perda e Luto": ["Perda", "Luto", "Saudade", "Dor", "Morte", "Falta"],
  "Gratidão e Alegria": ["Gratidão", "Alegria", "Felicidade", "Feliz", "Louvor", "Obrigado"],
  "Perdão e Culpa": ["Perdão", "Culpa", "Arrependimento", "Erro", "Falha", "Perdoar"],
  "Direção e Decisões": ["Direção", "Decisão", "Dúvida", "Caminho", "Escolha", "Passo"],
  "Proteção e Provisão": ["Proteção", "Provisão", "Cuidado", "Escassez", "Falta", "Dinheiro", "Trabalho"]
};

import * as fs from 'fs';

const versiculos = [];

for (let i = 0; i < newVerses.length; i++) {
  const v = newVerses[i];
  const code = `V${(i + 1).toString().padStart(3, '0')}`;
  
  versiculos.push({
    id: i + 1,
    codigo: code,
    categoria: v.cat,
    versiculo: v.text,
    referencia: v.ref,
    explicacao: v.expl,
    sentimentos: categoriesTags[v.cat] || ["esperança", "paz", "cuidado"]
  });
}

const data = { versiculos };

fs.writeFileSync('banco_versiculos.json', JSON.stringify(data, null, 2));
console.log("JSON generated successfully with exactly 100 verses from categories 1 to 10.");
