import { deleteCookie, setCookie } from '../../src/utils/cookie';

const API_URL = Cypress.env('BURGER_API_URL');
const REFRESH_TOKEN = 'test_refreshToken';
const ACCESS_TOKEN = 'test_accessToken';

describe('Конструктор', () => {
  beforeEach(() => {
    setCookie('accessToken', ACCESS_TOKEN);
    localStorage.setItem('refreshToken', REFRESH_TOKEN);

    cy.intercept('GET', `${API_URL}/auth/user`, { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('GET', `${API_URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getUser');
  });

  it('отображение ингредиентов', () => {
    cy.get('[data-cy=ingredient]').should('have.length.greaterThan', 0);
  });

  it('добавление в конструктор', () => {
    cy.get('[data-cy=constructor-bun-top]').should('not.exist');
    cy.get('[data-cy=constructor-bun-bottom]').should('not.exist');
    cy.contains('[data-cy=ingredient]', 'Краторная булка N-200i')
      .find('button')
      .click();
    cy.get('[data-cy=constructor-bun-top]').should(
      'contain',
      'Краторная булка N-200i (верх)'
    );
    cy.get('[data-cy=constructor-bun-bottom]').should(
      'contain',
      'Краторная булка N-200i (низ)'
    );

    cy.get('[data-cy=constructor-ingredients]').should(
      'not.contain',
      'Биокотлета из марсианской Магнолии'
    );
    cy.contains('[data-cy=ingredient]', 'Биокотлета из марсианской Магнолии')
      .find('button')
      .click();
    cy.get('[data-cy=constructor-ingredients]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('модальные окна', () => {
    cy.get('[data-cy=ingredient]').first().click();
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=ingredient-details-name]').should(
      'contain',
      'Краторная булка N-200i'
    );

    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=ingredient]').first().click();
    cy.get('[data-cy=modal]').should('be.visible');

    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('создание заказа', () => {
    cy.intercept('POST', `${API_URL}/orders`, { fixture: 'order.json' }).as('createOrder');

    cy.contains('[data-cy=ingredient]', 'Краторная булка N-200i').find('button').click();
    cy.contains('[data-cy=ingredient]', 'Сыр с астероидной плесенью').find('button').click();
    cy.contains('[data-cy=ingredient]', 'Биокотлета из марсианской Магнолии').find('button').click();
    cy.contains('[data-cy=ingredient]', 'Мини-салат Экзо-Плантаго').find('button').click();
    cy.contains('[data-cy=ingredient]', 'Плоды Фалленианского дерева').find('button').click();

    cy.get('[data-cy=place-order-button]').click();
    cy.wait('@createOrder');
    cy.get('[data-cy=modal]').should('be.visible');

    cy.get('[data-cy=order-number]').should('contain', '787878'); 

    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=constructor-bun-top]').should('not.exist');
    cy.get('[data-cy=constructor-bun-bottom]').should('not.exist');
  });
});
