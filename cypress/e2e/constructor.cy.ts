

describe('Конструктор', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.wait('@getIngredients');
  });





  it('should display ingredients', () => {
    cy.get('[data-cy=ingredient]').should('have.length.greaterThan', 0);
  });

  it('should add ingredients to the constructor', () => {
    // Находим булку и добавляем ее
    cy.contains('[data-cy=ingredient]', 'Булка Space').find('button').click();

    // Находим начинку и добавляем ее
    cy.contains(
      '[data-cy=ingredient]',
      'Мясо бессмертных моллюсков Protostomia'
    )
      .find('button')
      .click();

    // Проверяем, что булка появилась в конструкторе (верх и низ)
    cy.get('[data-cy=constructor-bun-top]').should(
      'contain',
      'Булка Space (верх)'
    );
    cy.get('[data-cy=constructor-bun-bottom]').should(
      'contain',
      'Булка Space (низ)'
    );

    // Проверяем, что начинка появилась в конструкторе
    cy.get('[data-cy=constructor-ingredients]').should(
      'contain',
      'Мясо бессмертных моллюсков Protostomia'
    );
  });
});
