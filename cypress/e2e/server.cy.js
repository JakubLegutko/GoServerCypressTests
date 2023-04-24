

describe('Server tests', () => {
    it('responds to a GET request', () => {
      cy.request('GET', 'http://localhost:8090/')
        .its('body')
        .should('contain', 'Hello World');
    });
    it("should visit the app", () => {
      cy.request("http://localhost:8090/");
    } );
    it("should not be able to visit non-existent endpoints", () => {
      cy.request({
        url: 'http://localhost:8090/api',
        failOnStatusCode: false
      })
      .its('status')
      .should('equal', 404);
    }
    );
    it("should return the dummy product", () => {
      cy.request('GET',"http://localhost:8090/products")
      .its('body')
      .then((response) => {
        const expectedProducts = [{id: "1", name: "Dummy", price: 1.99}];
        const actualProducts = response;



        expectedProducts.forEach((expectedProduct, index) => {
          expect(actualProducts[index].id).to.equal(expectedProduct.id);
          expect(actualProducts[index].name).to.equal(expectedProduct.name);
          expect(actualProducts[index].price).to.equal(expectedProduct.price);
        });
      });
    });
    it('Adds a product with id 3', () => {
      const newProduct = {id: "3", name: "New Product", price: 9.99};
  
      // Make a POST request to the /products endpoint to add a new product
      cy.request('POST', 'http://localhost:8090/products', newProduct)
        .then((response) => {
          expect(response.status).to.equal(201);
          expect(response.body).to.deep.equal(newProduct);
        });
  
      // Make a GET request to the /products endpoint to verify that the new product has been added
      cy.request("GET",'http://localhost:8090/products')
        .its('body')
        .then((response) => {
          const expectedProducts = [{id: "1", name: "Dummy", price: 1.99},{id: "3", name: "New Product", price: 9.99}];
          const actualProducts = response;
  
          expectedProducts.forEach((expectedProduct, index) => {
            expect(actualProducts[index].id).to.contain(expectedProduct.id);
            expect(actualProducts[index].name).to.contain(expectedProduct.name);
            expect(actualProducts[index].price).to.equal(expectedProduct.price);
          });
        });
    });
    it('Adds and Deletes a product with id 4', () => {
      const newProduct = {id: "4", name: "New Product Delete", price: 19.99};
  
      cy.request('POST', 'http://localhost:8090/products', newProduct)
      .then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.deep.equal(newProduct);
      });
      // Make a DELETE request to the /products endpoint to delete a product
      cy.request('DELETE', 'http://localhost:8090/products/4')
        .then((response) => {
          expect(response.status).to.equal(204);
        });
  
      // Make a GET request to the /products endpoint to verify that the new product has been deleted
      cy.request("GET",'http://localhost:8090/products')
        .its('body')
        .then((response) => {
          const expectedProducts = [{id: "4", name: "New Product Delete", price: 19.99}];
          const actualProducts = response;

          actualProducts.forEach((actualProduct, index) => {
            expect(actualProducts[index].id).to.not.contain(expectedProducts[0].id);
            expect(actualProducts[index].name).to.not.contain(expectedProducts[0].name);
            expect(actualProducts[index].price).to.not.equal(expectedProducts[0].price);
          });
        });
    }
    );
    it("should return the product of id 1", () => {
      cy.request('GET',"http://localhost:8090/products/1")
      .its('body')
      .then((response) => {
        const expectedProduct = {id: "1", name: "Dummy", price: 1.99};
        const actualProduct = response;
        expect(actualProduct.id).to.equal(expectedProduct.id);
        expect(actualProduct.name).to.equal(expectedProduct.name);
        expect(actualProduct.price).to.equal(expectedProduct.price);
      });
    }
    );
    it("should get a 404 error for the product of id 5", () => {
      cy.request({
        url: 'http://localhost:8090/products/5',
        failOnStatusCode: false
      })
      .its('status')
      .should('equal', 404);
    }
    );
    it("should update the product of id 2", () => {
      const oldProduct = {id: "2", name: "Dummy Update", price: 3.99};
      const updatedProduct = {id: "2", name: "Updated Product", price: 29.99};
      cy.request( "POST", 'http://localhost:8090/products', oldProduct)

      cy.request('PUT', 'http://localhost:8090/products/2', updatedProduct)
      .its('body')
      .then((response) => {
        const expectedProduct = {id: "2", name: "Updated Product", price: 29.99};
        const actualProduct = response;
        expect(actualProduct.id).to.equal(expectedProduct.id);
        expect(actualProduct.name).to.equal(expectedProduct.name);
        expect(actualProduct.price).to.equal(expectedProduct.price);
      });
    }
    );
    it("should get a 404 error for the product of id 6 if updating non-existent", () => {
      const updatedProduct = {id: "6", name: "Updated Product2", price: 39.99};
      cy.request({
        url: 'http://localhost:8090/products/6',
        method: 'PUT',
        body: updatedProduct,
        failOnStatusCode: false
      })
      .its('status')
      .should('equal', 404);
    }
    );
    it("should get a 400 while posting an invalid product", () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/products',
        failOnStatusCode: false
      })
      .its('status')
      .should('equal', 400);
    }
    );
    it("should get a 400 while posting an invalid ID", () => {
      const badProduct = {id: "" , name: "Dummy", price: 1.99};
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/products',
        body: badProduct,
        failOnStatusCode: false
      })
      .its('status')
      .should('equal', 400);
    }
    );
    it("should get a 400 while posting an invalid ID", () => {
      const badProduct = {id: "10" , name: "Dummy", price: 0};
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/products',
        body: badProduct,
        failOnStatusCode: false
      })
      .its('status')
      .should('equal', 402);
    }
    );
    it("should get a 409 while posting an existing ID", () => {
      const badProduct ={id: "1", name: "DifferentSameId", price: 39.99};
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/products',
        body: badProduct,
        failOnStatusCode: false
      })
      .its('status')
      .should('equal', 409);
    }
    );
    it("should get a 404 while deleting an invalid product", () => {
      cy.request({
        method: 'DELETE',
        url: 'http://localhost:8090/products/6',
        failOnStatusCode: false
      })
      .its('status')
      .should('equal', 404);
    }
    );
    it("should get the dummy payment", () => {
      cy.request('GET',"http://localhost:8090/api/payments")
      .its('body')
      .then((response) => {
        const expectedPayments = [{cardNumber: "1231323123", expirationDate: "12/12/2020", cvv: "123"}];
        const actualPayments = response;
        expectedPayments.forEach((expectedPayment, index) => {
          expect(actualPayments[index].cardNumber).to.equal(expectedPayment.cardNumber);
          expect(actualPayments[index].expirationDate).to.equal(expectedPayment.expirationDate);
          expect(actualPayments[index].cvv).to.equal(expectedPayment.cvv);
        });
      });
    }
    );
    it("should post the dummy payment", () => {
      const newPayment = {cardNumber:"1234123412", expirationDate: "21/37/2005", cvv: "123"};
  
      // Make a POST request to the /payments endpoint to add a new payment
      cy.request('POST', 'http://localhost:8090/api/payment', newPayment)
        .then((response) => {
          expect(response.status).to.equal(201);
          expect(response.body).to.contain(newPayment);
        });

    });
    it("should not accept payment without CVV", () => {
      const newPayment = {cardNumber: "1234123412341234", expirationDate: "21/37/2005", cvv: ""};
      
      // Make a POST request to the /payments endpoint to add a new payment
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/payment',
        body: newPayment,
        failOnStatusCode: false
      })
      .its('status')
      .should('equal', 402);

    });
    it("should not accept payment without valid CVV", () => {
      const newPayment = {cardNumber: "1234123412341234", expirationDate: "21/37/2005", cvv: "2223"};
  
      // Make a POST request to the /payments endpoint to add a new payment
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/payment',
        body: newPayment,
        failOnStatusCode: false
      })
      .its('status')
      .should('equal', 409);

    });
    it("should not accept payment without valid card number", () => {
      const newPayment = {cardNumber: "12341234123412231231231231", expirationDate: "21/37/2005", cvv: "222"};
  
      // Make a POST request to the /payments endpoint to add a new payment
      cy.request({
        method: 'POST',
        url: 'http://localhost:8090/api/payment',
        body: newPayment,
        failOnStatusCode: false
      })
      .its('status')
      .should('equal', 409);

    });
  });