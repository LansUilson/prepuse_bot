const axios = require('axios');

async function f() {
	const response = await axios.post('https://api.openai.com/v1/chat/completions', {
		"model": "gpt-3.5-turbo",
		"messages": [
			{
				"role": "user", 
				"content": `Сейчас я скину тебе задание, критерии оценивания и работу, которую тебе нужно будет оценить по критериям
Задание: Напишите сочинение по прочитанному тексту.

Сформулируйте одну из проблем, поставленных автором текста.

Прокомментируйте сформулированную проблему. Включите в комментарий два примера-иллюстрации из прочитанного текста, которые важны для понимания проблемы исходного текста (избегайте чрезмерного цитирования). Дайте пояснение к каждому примеру-иллюстрации. Проанализируйте смысловую связь между примерами-иллюстрациями.

Сформулируйте позицию автора (рассказчика). Сформулируйте и обоснуйте своё отношение к позиции автора (рассказчика) по проблеме исходного текста.

Объём сочинения  — не менее 150 слов.

Работа, написанная без опоры на прочитанный текст (не по данному тексту), не оценивается. Если сочинение представляет собой пересказанный или полностью переписанный исходный текст без каких бы то ни было комментариев, то такая работа оценивается 0 баллов.

Сочинение пишите аккуратно, разборчивым почерком.

Проблемы:

1.  Проблема значимости человеческой личности. (В чём заключается значимость человеческой личности?)

2.  Проблема мужества и стойкости. (Что может помочь победить более сильного врага?)

3.  Проблема героизма. (В чём проявляется героизм человека на войне?)

 

Позиция автора:

1.  Значимость личности заключается в её влиянии на исторический ход событий в том что человек принимает на себя ответственность «за судьбу всего мира».

2.  Победа над превосходящими силами противника может быть одержана благодаря самоотверженности и отваге простых солдат ежедневно выполнявших свой долг перед Родиной.

3.  Героизм человека на войне может проявляться в преодолении самых суровых обстоятельств.

Текст сочинения:
 В годы тяжёлых для страны испытаний народ встаёт на защиту своей родины А в чём же проявляется героизм человека на войне? Над этой важной проблемой рассуждает В.П. Некрасов в своём произведении.

Критерии:
К1 (критерий 1)	Формулировка проблем исходного текста. 
1 балл - Одна из проблем исходного текста (в той или иной форме в любой из частей сочинения) сформулирована верно
0 баллов - Проблема исходного текста не сформулирована или сформулирована неверно.
К2 (критерий 2)	Комментарий к проблеме исходного текста.
5 баллов - Приведено не менее 2 примеров-иллюстраций из прочитанного текста. Дано пояснение к каждому из примеров-иллюстраций. Проанализирована смысловая связь между примерами-иллюстрациями
4 балла - Проблема прокомментирована с опорой на исходный текст.
Приведено не менее 2 примеров-иллюстраций из прочитанного текста, важных для понимания проблемы исходного текста. Дано пояснение к каждому из примеров-иллюстраций.
Смысловая связь между примерами-иллюстрациями не проанализирована (или проанализирована неверно).
ИЛИ Проблема прокомментирована с опорой на исходный текст.
Приведено не менее 2 примеров-иллюстраций из прочитанного текста, важных для понимания проблемы исходного текста. Дано пояснение к одному из примеров-иллюстраций.
Проанализирована смысловая связь между примерами-иллюстрациями
3 балла - Проблема прокомментирована с опорой на исходный текст.
Приведено не менее 2 примеров-иллюстраций из прочитанного текста, важных для понимания проблемы исходного текста.
Пояснения к примерам-иллюстрациям не даны.
Проанализирована смысловая связь между примерами-иллюстрациями
2  балла - Проблема прокомментирована с опорой на исходный текст.
Приведено не менее 2 примеров-иллюстраций из прочитанного текста, важных для понимания проблемы исходного текста. Пояснения к примерам-иллюстрациям не даны.
Смысловая связь между примерами-иллюстрациями не проанализирована (или проанализирована неверно).
1 балл - Проблема прокомментирована с опорой на исходный текст.
Приведён 1 пример-иллюстрация из прочитанного текста, важный для понимания проблемы исходного текста. Пояснения к этому примеру-иллюстрации не даны
0 баллов - Проблема прокомментирована без опоры на исходный текст.
К3 (критерий 3)	Отражение позиции автора по проблеме исходного текста.
1 балл - Позиция автора (рассказчика) по проблеме исходного текста сформулирована верно
0 баллов - Позиция автора (рассказчика) по проблеме исходного текста сформулирована неверно.
К4 (критерий 4)	Отношение к позиции автора по проблеме исходного текста. 
1 балл - Отношение к позиции автора (рассказчика) исходного текста сформулировано и обосновано
0 баллов - Отношение к позиции автора (рассказчика) исходного текста не сформулировано и не обосновано.
К5 (критерий 5)	Смысловая цельность, речевая связность и последовательность изложения. 
2 балла - Работа характеризуется смысловой цельностью, речевой связностью и последовательностью изложения. В работе нет нарушений абзацного членения текста. Логические ошибки отсутствуют
1 балл - Работа характеризуется смысловой цельностью, связностью и последовательностью изложения.
В работе нет нарушений абзацного членения текста. Допущена одна логическая ошибка.
ИЛИ Работа характеризуется смысловой цельностью, связностью и последовательностью изложения.
Логических ошибок нет. Имеется одно нарушение абзацного членения текста.
ИЛИ Работа характеризуется смысловой цельностью, связностью и последовательностью изложения.
Имеется одно нарушение абзацного членения текста.
Допущена одна логическая ошибка
0 баллов - В работе экзаменуемого просматривается коммуникативный замысел. Нарушений абзацного членения нет. Допущено две и более логические ошибки.
К6 (критерий 6)	Точность и выразительность речи.
2 балла - Работа характеризуется точностью выражения мысли, разнообразием грамматического строя речи.
Указание к оцениванию. Высший балл по этому критерию экзаменуемый получает только в случае, если высший балл получен по критерию К10
1 балл - Работа характеризуется точностью выражения мысли, но прослеживается однообразие грамматического строя речи.
0 баллов - Работа характеризуется бедностью словаря и однообразием грамматического строя речи
К7	(критерий 7)	Соблюдение орфографических норм. До 3 баллов
К8	(критерий 8)	Соблюдение пунктуационных норм. До 3 баллов
К9	(критерий 9)	Соблюдение грамматических норм. До 2 баллов
К10	(критерий 10) Соблюдение речевых норм. До 2 баллов
К11	(критерий 11) Соблюдение этических норм. До 1 балла
К12	(критерий 12) Соблюдение фактологической точности. До 1 балла
Максимальное количество баллов	- 24

ОПИШИ СВОЮ ОЦЕНКУ ПО КАЖДОМУ КРИТЕРИЮ. Пример:
К1: 1 балл
К2: 5 баллов
...`
			}
		],
		"temperature": 0.7
	}, {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer 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',
		},
	});
	console.log(response.data.choices[0].message.content)
	return response.data;// .choices[0].text.trim()
}
f()