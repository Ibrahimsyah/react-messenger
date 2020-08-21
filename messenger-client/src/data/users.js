export default [
    {
        user_id: 'aabbcc',
        name: 'Alex',
        image: 'https://media.gettyimages.com/photos/woman-lifts-her-arms-in-victory-mount-everest-national-park-picture-id507910624?s=612x612',
        messages: [
            {
                id: '1',
                isMine: false,
                message: 'Hello There!'
            },
            {
                id: 2,
                isMine: true,
                message: 'Hey Whatsup!'
            }
        ]
    },
    {
        user_id: 'abcadv',
        name: 'Cartono',
        image: 'https://image.freepik.com/free-photo/image-human-brain_99433-298.jpg',
        messages: [
            {
                id: '1',
                isMine: false,
                message: 'Pripun Kabare'
            },
            {
                id: 2,
                isMine: true,
                message: 'Alhamdulillah Sae'
            },
            {
                id: 3,
                isMine: true,
                message: 'Njenenang Pripun?'
            }
        ]
    },
    {
        user_id: 'azxca',
        name: 'Siro',
        image: 'https://images.unsplash.com/photo-1556103255-4443dbae8e5a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
        messages: [
            {
                id: '1',
                isMine: false,
                message: 'Hey, can u give me some advice for our book?'
            },
            {
                id: 2,
                isMine: true,
                message: 'Sure!'
            },
            {
                id:3,
                isMine:false,
                message: '[img]https://marketplace.canva.com/EAD7Wcsm-Ag/1/0/251w/canva-blue%2C-orange-and-yellow-cool-memoir-inspirational-book-cover-oPnpM1GRzr8.jpg'
            },
            {
                id:4,
                isMine: false,
                message: 'How about that?'
            },
            {
                id:5,
                isMine:true,
                replying: {
                    id:3,
                    isMine:false,
                    message: '[img]https://marketplace.canva.com/EAD7Wcsm-Ag/1/0/251w/canva-blue%2C-orange-and-yellow-cool-memoir-inspirational-book-cover-oPnpM1GRzr8.jpg'
                },
                message: 'this is so cool man! but u can improve more at the color. maybe we can use blue or green'
            }
        ]
    }
]