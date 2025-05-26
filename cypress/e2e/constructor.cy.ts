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

  it('should display ingredients', () => {
    cy.get('[data-cy=ingredient]').should('have.length.greaterThan', 0);
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

  it('should add ingredients to the constructor', () => {
    // Check that buns are not in the constructor initially
    cy.get('[data-cy=constructor-bun-top]').should('not.exist');
    cy.get('[data-cy=constructor-bun-bottom]').should('not.exist');

    cy.contains('[data-cy=ingredient]', 'Булка Space').find('button').click();

    // Check that buns are now in the constructor
    cy.get('[data-cy=constructor-bun-top]').should(
      'contain',
      'Булка Space (верх)'
    );
    cy.get('[data-cy=constructor-bun-bottom]').should(
      'contain',
      'Булка Space (низ)'
    );

    // Check that the ingredient is not in the constructor initially
    cy.get('[data-cy=constructor-ingredients]').should(
      'not.contain',
      'Мясо бессмертных моллюсков Protostomia'
    );

    cy.contains(
      '[data-cy=ingredient]',
      'Мясо бессмертных моллюсков Protostomia'
    )
      .find('button')
      .click();

    // Check that the ingredient is now in the constructor
    cy.get('[data-cy=constructor-ingredients]').should(
      'contain',
      'Мясо бессмертных моллюсков Protostomia'
    );
  });
});
