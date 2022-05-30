
import signupPage from '../support/pages/signup'


describe('cadastro', function () {

    context('quando o usuario é novo', function () {
        const user = {
            name: 'Giovanne Silva',
            email: 'giovanneqa@samurai.com',
            password: '189478'
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('deve cadastrar o novo usuário', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')

        })

    })

    context('quando o email ja foi usado', function () {
        const user = {
            name: 'Giovanne Barbosa',
            email: 'giovannebarbosa@samurai.com',
            password: '189478',
            is_provider: true
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })
        })

        it('não deve cadastrar o usuário', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')

        })

    })

    context('quando o formato do email é inválido', function () {
        const user = {
            name: 'Giovanni Braiz',
            email: 'giovanni.live.com',
            password: '189478'
        }

        it('deve exibir alerta de email inválido', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')
        })
    })

    context('quando a senha não atingi o mínimo', function () {

        const passwords = ['1', '12', '123', '1234', '12345']

        beforeEach(function () {
            signupPage.go()
        })

        passwords.forEach(function (p) {
            it('não deve ser cadastrada' + p, function () {
                const user = { name: 'Giovanne Silva', email: 'giovanneqa@samurai.com', password: p }

                signupPage.form(user)
                signupPage.submit()
            })
        })

        afterEach(function () {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })
    })

    context('quando não for preenchido nem um campo', function () {

        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function () {
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function (a) {
            it('deve exibir ' + a.toLowerCase(), function () {
                signupPage.alertHaveText(a)
            })
        })
    })
})


