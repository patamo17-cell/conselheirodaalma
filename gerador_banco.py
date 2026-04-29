import json

def gerar_banco_completo():
    categorias_config = {
        "Ansiedade e Preocupação": [
            ("Filipenses 4:6-7", "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus."),
            ("1 Pedro 5:7", "Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês."),
            ("Mateus 6:34", "Portanto, não se preocupem com o amanhã, pois o amanhã trará as suas próprias preocupações."),
            ("Salmos 94:19", "Quando a ansiedade já dominava o meu íntimo, o teu consolo trouxe alívio à minha alma."),
            ("Salmos 55:22", "Entregue as suas preocupações ao Senhor, e ele o susterá; jamais permitirá que o justo venha a cair."),
            ("Isaías 26:3", "Tu, Senhor, guardarás em perfeita paz aquele cujo propósito é firme, porque em ti confia."),
            ("Mateus 11:28", "Venham a mim, todos os que estão cansados e sobrecarregados, e eu lhes darei descanso."),
            ("Lucas 12:22", "Não andeis ansiosos pela vossa vida, quanto ao que haveis de comer, nem pelo vosso corpo."),
            ("Salmos 34:4", "Busquei o Senhor, e ele me respondeu; livrou-me de todos os meus temores."),
            ("Provérbios 12:25", "O coração ansioso deprime o homem, mas uma palavra bondosa o anima.")
        ],
        "Medo e Insegurança": [
            ("Isaías 41:10", "Por isso não tema, pois estou com você; não tenha medo, pois sou o seu Deus."),
            ("Salmos 27:1", "O Senhor é a minha luz e a minha salvação; de quem terei temor?"),
            ("2 Timóteo 1:7", "Pois Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio."),
            ("Salmos 56:3", "Mas eu, quando estiver com medo, confiarei em ti."),
            ("Josué 1:9", "Não fui eu que lhe ordenei? Seja forte e corajoso! Não se apavore, nem se desanime."),
            ("Salmos 23:4", "Mesmo quando eu andar por um vale de trevas e morte, não temerei perigo algum."),
            ("Deuteronômio 31:6", "Sejam fortes e corajosos. Não tenham medo nem fiquem apavorados por causa delas."),
            ("Salmos 118:6", "O Senhor está comigo, não temerei. O que me podem fazer os homens?"),
            ("Isaías 43:1", "Mas agora assim diz o Senhor: Não tema, pois eu o resgatei; eu o chamei pelo nome."),
            ("Salmos 91:5", "Você não temerá o pavor da noite, nem a flecha que voa de dia.")
        ],
        "Tristeza e Depressão": [
            ("Salmos 34:18", "O Senhor está perto dos que têm o coração quebrantado e salva os de espírito abatido."),
            ("João 16:33", "No mundo tereis aflições, mas tende bom ânimo, eu venci o mundo."),
            ("Salmos 147:3", "Ele cura os que têm o coração quebrantado e cuida das suas feridas."),
            ("Mateus 5:4", "Bem-aventurados os que choram, pois serão consolados."),
            ("Salmos 30:5", "O choro pode durar uma noite, mas a alegria vem pela manhã."),
            ("Isaías 41:13", "Porque eu, o Senhor teu Deus, te tomo pela tua mão direita; e te digo: Não temas, eu te ajudo."),
            ("Salmos 42:11", "Por que você está assim tão triste, ó minha alma? Por que está assim tão perturbada dentro de mim?"),
            ("2 Coríntios 1:3-4", "Pai das misericórdias e o Deus de toda a consolação, que nos consola em todas as nossas tribulações."),
            ("Apocalipse 21:4", "Ele enxugará dos seus olhos toda lágrima. Não haverá mais morte, nem tristeza, nem choro, nem dor."),
            ("Salmos 126:5", "Os que semeiam com lágrimas, com cantos de alegria colherão.")
        ],
        "Solidão e Abandono": [
            ("Mateus 28:20", "E eu estarei sempre com vocês, até o fim dos tempos."),
            ("Hebreus 13:5", "Nunca o deixarei, nunca o abandonarei."),
            ("Salmos 27:10", "Ainda que me abandonem pai e mãe, o Senhor me acolherá."),
            ("Isaías 49:15", "Será que uma mãe pode esquecer do seu bebê? Ainda que ela se esqueça, eu não me esquecerei de você."),
            ("João 14:18", "Não os deixarei órfãos; voltarei para vocês."),
            ("Salmos 68:6", "Deus faz que o solitário viva em família; liberta os presos e os faz prosperar."),
            ("Romanos 8:38-39", "Pois estou convencido de que nem a morte nem a vida poderão nos separar do amor de Deus."),
            ("Deuteronômio 31:8", "O próprio Senhor irá à sua frente e estará com você; ele nunca o deixará."),
            ("Salmos 139:7", "Para onde poderia eu escapar do teu Espírito? Para onde poderia fugir da tua presença?"),
            ("Isaías 41:17", "Os pobres e necessitados buscam água, e não a encontram. Eu, o Senhor, lhes responderei.")
        ],
        "Cansaço e Desânimo": [
            ("Isaías 40:31", "Mas aqueles que esperam no Senhor renovam as suas forças. Voam alto como águias."),
            ("Gálatas 6:9", "E não nos cansemos de fazer o bem, pois no tempo próprio colheremos, se não desanimarmos."),
            ("Mateus 11:29", "Tomem sobre vocês o meu jugo e aprendam de mim, pois sou manso e humilde de coração."),
            ("Salmos 73:26", "A minha carne e o meu coração podem fraquejar, mas Deus é a fortaleza do meu coração."),
            ("2 Coríntios 4:16", "Por isso não desanimamos. Embora exteriormente estejamos a desgastar-nos, interiormente estamos sendo renovados."),
            ("Filipenses 4:13", "Tudo posso naquele que me fortalece."),
            ("Neemias 8:10", "Não fiquem tristes, pois a alegria do Senhor é a vossa força."),
            ("Salmos 119:28", "A minha alma se consome de tristeza; fortalece-me conforme a tua palavra."),
            ("Jeremias 31:25", "Restaurarei o exausto e saciarei o enfraquecido."),
            ("Salmos 28:7", "O Senhor é a minha força e o meu escudo; nele o meu coração confia.")
        ],
        "Perda e Luto": [
            ("João 11:25", "Disse-lhe Jesus: Eu sou a ressurreição e a vida. Aquele que crê em mim, ainda que morra, viverá."),
            ("Salmos 23:1", "O Senhor é o meu pastor; nada me faltará."),
            ("1 Tessalonicenses 4:13", "Irmãos, não queremos que vocês sejam ignorantes quanto aos que dormem, para que não se entristeçam como os outros."),
            ("João 14:1-3", "Não se turbe o vosso coração; credes em Deus, crede também em mim."),
            ("Salmos 116:15", "Preciosa é à vista do Senhor a morte dos seus santos."),
            ("2 Coríntios 5:1", "Sabemos que, se for destruída a temporária habitação terrena em que vivemos, temos da parte de Deus um edifício."),
            ("Filipenses 1:21", "Porque para mim o viver é Cristo e o morrer é lucro."),
            ("Salmos 34:17", "Os justos clamam, o Senhor os ouve e os livra de todas as suas tribulações."),
            ("Isaías 57:1", "O justo perece, e ninguém se importa; os homens piedosos são arrebatados, e ninguém compreende."),
            ("Romanos 14:8", "Se vivemos, vivemos para o Senhor; e, se morremos, morremos para o Senhor.")
        ],
        "Gratidão e Alegria": [
            ("1 Tessalonicenses 5:18", "Dêem graças em todas as circunstâncias, pois esta é a vontade de Deus para vocês."),
            ("Salmos 118:24", "Este é o dia que o Senhor fez; exultemos e alegremo-nos nele."),
            ("Salmos 100:2", "Sirvam ao Senhor com alegria; apresentem-se diante dele com cânticos de júbilo."),
            ("Filipenses 4:4", "Alegrem-se sempre no Senhor. Novamente direi: Alegrem-se!"),
            ("Salmos 103:1", "Bendiga o Senhor a minha alma! Bendiga o seu santo nome todo o meu ser."),
            ("Colossenses 3:15", "Que a paz de Cristo seja o juiz em seus corações... E sejam agradecidos."),
            ("Salmos 16:11", "Tu me farás conhecer a vereda da vida, a alegria plena da tua presença."),
            ("Tiago 1:2", "Meus irmãos, considerem motivo de grande alegria sempre que passarem por diversas provações."),
            ("Salmos 92:1", "Como é bom render graças ao Senhor e cantar louvores ao teu nome, ó Altíssimo."),
            ("Habacuque 3:17-18", "Ainda que a figueira não floresça... todavia eu me alegrarei no Senhor.")
        ],
        "Perdão e Culpa": [
            ("1 João 1:9", "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados."),
            ("Salmos 103:12", "Quanto o oriente está longe do ocidente, tanto ele afasta de nós as nossas transgressões."),
            ("Miquéias 7:19", "De novo terás compaixão de nós; pisarás as nossas maldades e atirarás todos os nossos pecados nas profundezas do mar."),
            ("Romanos 8:1", "Portanto, agora já não há condenação para os que estão em Cristo Jesus."),
            ("Isaías 1:18", "Embora os seus pecados sejam vermelhos como o escarlate, eles se tornarão brancos como a neve."),
            ("Efésios 1:7", "Nele temos a redenção por meio de seu sangue, o perdão dos pecados."),
            ("Salmos 32:1", "Como é feliz aquele que tem suas transgressões perdoadas e seus pecados apagados!"),
            ("Colossenses 1:14", "No qual temos a redenção, a saber, o perdão dos pecados."),
            ("Hebreus 8:12", "Pois eu perdoarei a sua maldade e não me lembrarei mais dos seus pecados."),
            ("2 Coríntios 5:17", "Portanto, se alguém está em Cristo, é nova criação; as coisas antigas já passaram.")
        ],
        "Direção e Decisões": [
            ("Provérbios 3:5-6", "Confie no Senhor de todo o seu coração... e ele endireitará as suas veredas."),
            ("Salmos 32:8", "Eu o instruirei e o ensinarei no caminho que você deve seguir; eu o aconselharei."),
            ("Tiago 1:5", "Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente."),
            ("Salmos 119:105", "A tua palavra é lâmpada que ilumina os meus passos e luz que clareia o meu caminho."),
            ("Isaías 30:21", "Quer você se volte para a direita quer para a esquerda, uma voz atrás de você dirá: Este é o caminho."),
            ("Salmos 25:4", "Mostra-me, Senhor, os teus caminhos, ensina-me as tuas veredas."),
            ("Provérbios 16:3", "Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos."),
            ("Salmos 37:5", "Entregue o seu caminho ao Senhor; confie nele, e ele agirá."),
            ("Jeremias 29:11", "Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar."),
            ("João 16:13", "Mas quando o Espírito da verdade vier, ele os guiará a toda a verdade.")
        ],
        "Providência e Finanças": [
            ("Filipenses 4:19", "O meu Deus suprirá todas as necessidades de vocês, de acordo com as suas gloriosas riquezas."),
            ("Salmos 37:25", "Fui moço e agora sou velho, mas nunca vi o justo desamparado, nem seus filhos mendigando o pão."),
            ("Mateus 6:33", "Busquem, pois, em primeiro lugar o Reino de Deus e a sua justiça, e todas essas coisas lhes serão acrescentadas."),
            ("Malaquias 3:10", "Tragam o dízimo todo ao depósito do templo... e vejam se não vou abrir as janelas do céu."),
            ("Salmos 34:10", "Os leões podem passar necessidade e fome, mas os que buscam o Senhor de nada têm falta."),
            ("Provérbios 10:22", "A bênção do Senhor traz riqueza, e ele não permite que a tristeza a acompanhe."),
            ("2 Coríntios 9:8", "E Deus é poderoso para fazer que toda a graça lhes seja acrescentada."),
            ("Salmos 23:1", "O Senhor é o meu pastor; nada me faltará."),
            ("Lucas 6:38", "Dêem, e lhes será dado: uma boa medida, recalcada, sacudida e transbordante."),
            ("Deuteronômio 8:18", "Lembrem-se do Senhor, do seu Deus, pois é ele que lhes dá a capacidade de produzir riqueza.")
        ]
    }

    def criar_explicacao(categoria):
        return (f"Alma querida, receba essa palavra profética diretamente no seu espírito! Eu sei que a luta contra essa {categoria.lower()} tem sido intensa, mas declare agora: 'O meu Deus é maior e a vitória já é minha!'. "
                "Essa situação não tem poder sobre a sua vida porque você está debaixo da unção e da proteção do Altíssimo. Em nome de Jesus, eu profetizo que as correntes da opressão estão caindo por terra hoje pelo poder do Espírito Santo. "
                "O Senhor está soprando um fôlego novo sobre você, trazendo paz, provisão e abrindo portas onde o mundo disse que estava fechado. Não aceite o desânimo, pois o Senhor já assinou o seu decreto de libertação e prosperidade. "
                "Tome posse da sua benção, declare a sua vitória e descanse no poder do sangue de Jesus, pois o melhor de Deus ainda está por vir na sua vida!")

    sentimentos_map = {
        "Ansiedade e Preocupação": ["ansiedade", "preocupação", "nervosismo", "medo do futuro"],
        "Medo e Insegurança": ["medo", "insegurança", "pavor", "incerteza"],
        "Tristeza Profunda e Angústia": ["tristeza", "desânimo", "angústia"],
        "Solidão e Abandono": ["solidão", "vazio", "abandono", "rejeição"],
        "Cansaço e Desânimo": ["cansaço", "fadiga", "esgotamento", "falta de força"],
        "Perda e Luto": ["luto", "perda", "saudade", "dor da separação"],
        "Gratidão e Alegria": ["gratidão", "alegria", "felicidade", "louvor"],
        "Perdão e Culpa": ["culpa", "perdão", "arrependimento", "condenação"],
        "Direção e Decisões": ["direção", "decisão", "escolha", "confusão"],
        "Providência e Finanças": ["escassez", "finanças", "provisão", "necessidade"]
    }

    banco = {"versiculos": []}
    id_cont = 1

    for cat, versiculos in categorias_config.items():
        for ref, texto in versiculos:
            item = {
                "id": id_cont,
                "codigo": f"V{id_cont:03d}",
                "categoria": cat,
                "sentimentos": sentimentos_map[cat],
                "versiculo": texto,
                "referencia": ref,
                "explicacao": criar_explicacao(cat)
            }
            banco["versiculos"].append(item)
            id_cont += 1

    with open('banco_versiculos.json', 'w', encoding='utf-8') as f:
        json.dump(banco, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    gerar_banco_completo()
