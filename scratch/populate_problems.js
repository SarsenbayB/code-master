require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase env variables are missing!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const problems = [
    { title: 'Екі санның қосындысы', topic: 'Негіздер', difficulty: 'easy', description: 'Екі бүтін сан берілген. Олардың қосындысын табыңыз.' },
    { title: 'Факториалды табу', topic: 'Циклдар', difficulty: 'medium', description: 'N саны берілген. Оның факториалын (N!) есептеңіз.' },
    { title: 'Палиндромды тексеру', topic: 'Мәтіндер', difficulty: 'medium', description: 'Мәтін берілген. Оның палиндром екенін анықтаңыз.' },
    { title: 'Тізімдегі максимум', topic: 'Массивтер', difficulty: 'easy', description: 'Сандар тізімі берілген. Ең үлкен мәнді табыңыз.' },
    { title: 'Фибоначчи қатары', topic: 'Рекурсия', difficulty: 'hard', description: 'N-ші фибоначчи санын табыңыз.' },
    { title: 'Жай сандар', topic: 'Математика', difficulty: 'medium', description: 'N-ге дейінгі барлық жай сандарды анықтаңыз.' },
    { title: 'Сөздерді санау', topic: 'Стрингтер', difficulty: 'easy', description: 'Сөйлемде неше сөз бар екенін санап шығыңыз.' },
    { title: 'Көбейту кестесі', topic: 'Циклдар', difficulty: 'easy', description: '1-ден 10-ға дейінгі көбейту кестесін шығарыңыз.' },
    { title: 'Квадрат теңдеу', topic: 'Алгебра', difficulty: 'hard', description: 'Квадрат теңдеудің түбірлерін табыңыз.' },
    { title: 'Жиымды сұрыптау', topic: 'Алгоритмдер', difficulty: 'medium', description: 'Сандар жиынын сұрыптаңыз.' }
];

async function populate() {
    console.log('Inserting problems...');

    const { data, error } = await supabase
        .from('problems')
        .insert(problems);

    if (error) {
        console.error('Error inserting:', error);
    } else {
        console.log('Success!');
    }
}

populate();