import {greet} from "../../src";

describe('Method: greet', () => {
   test('Assert: call console.log', () => {
      // Arrange
      jest.spyOn(console, 'log');

      // Act
      greet();

      // Assert
      expect(console.log).toBeCalled();
   });
});