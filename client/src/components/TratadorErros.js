import PubSub from 'pubsub-js';

export default class TratadorErros {

    publicaErros(promise) {
        promise
            .then(erros => {
                for (let i = 0; i < erros.length; i++) {
                    let erro = erros[i];
                    PubSub.publish('erro-validacao', erro);
                }
            });
    }
}