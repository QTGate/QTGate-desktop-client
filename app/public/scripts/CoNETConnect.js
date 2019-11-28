/*!
 * Copyright 2018 CoNET Technology Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class CoNETConnect {
    constructor(email, isKeypairBeSign, confirmRisk, account, ready) {
        this.email = email;
        this.isKeypairBeSign = isKeypairBeSign;
        this.account = account;
        this.ready = ready;
        this.showSendImapDataWarning = ko.observable(false);
        this.showConnectCoNETProcess = ko.observable(true);
        this.connectStage = ko.observable(0);
        this.connetcError = ko.observable(-1);
        this.connectedCoNET = ko.observable(false);
        this.maynotConnectConet = ko.observable(false);
        this.Loading = ko.observable(false);
        this.listenFun = null;
        this.showTryAgain = ko.observable(false);
        this.showSendConnectMail = ko.observable(false);
        this.showNetworkError = ko.observable(false);
        this.infoTextArray = ko.observableArray([]);
        this.keyPairSign = ko.observable(null);
        const self = this;
        if (!confirmRisk) {
            this.showSendImapDataWarning(true);
        }
        else {
            this.imapConform();
            this.Loading(true);
        }
    }
    listingConnectStage(err, stage) {
        const self = this;
        this.showConnectCoNETProcess(true);
        /*
        if ( typeof err === 'number' && err > -1 ) {
            this.connectStage ( -1 )
            this.ready ( err )
            _view.connectInformationMessage.socketIo.removeListener ( 'tryConnectCoNETStage', this.listenFun )
            return this.connetcError ( err )
        }
        */
        switch (stage) {
            case 1: {
                const index = this.infoTextArray()[this.infoTextArray().length - 1];
                if (!index) {
                    return;
                }
                index.text('connectedMailServer');
                return index.err(false);
            }
            /**
             * 	waiting pong
             */
            case 2: {
                return this.infoTextArray.push({ text: ko.observable('waitingPong'), err: ko.observable(null) });
            }
            /**
             * 	sendConnectRequestMail
             */
            case 3: {
                return this.infoTextArray.push({ text: ko.observable('sendConnectRequestMail'), err: ko.observable(null) });
            }
            /**
             * 	timeOut error!
             */
            case 0: {
                self.Loading(false);
                self.showSendConnectMail(true);
                return self.infoTextArray.push({ text: ko.observable('timeOut'), err: ko.observable(true) });
            }
            /**
             * 	connected node
             */
            case 4: {
                this.Loading(false);
                this.showConnectCoNETProcess(false);
                this.connectedCoNET(true);
                _view.connectInformationMessage.socketIo.removeListener('tryConnectCoNETStage', this.listenFun);
                if (!this.isKeypairBeSign) {
                    if (!this.keyPairSign()) {
                        let u = null;
                        return this.keyPairSign(u = new keyPairSign((function () {
                            self.keyPairSign(u = null);
                            self.ready(null);
                        })));
                    }
                    return;
                }
                _view.showIconBar(true);
                return this.ready(null);
            }
            /**
             * 	connectToMailServer
             */
            case 5: {
                return this.infoTextArray.push({ text: ko.observable('connectToMailServer'), err: ko.observable(null) });
            }
            /**
             * 	Client error!
             */
            case -1: {
                this.Loading(false);
                _view.connectInformationMessage.socketIo.removeListener('tryConnectCoNETStage', this.listenFun);
                return this.infoTextArray.push({ text: ko.observable('systemError'), err: ko.observable(true) });
            }
            /**
             * 	network error!
             */
            case -2: {
                this.Loading(false);
                this.showNetworkError(true);
                return this.infoTextArray.push({ text: ko.observable('offline'), err: ko.observable(true) });
            }
        }
    }
    returnToImapSetup() {
        return this.ready(0);
    }
    sendConnectMail() {
        this.Loading(true);
        this.showTryAgain(false);
        _view.connectInformationMessage.sockEmit('sendRequestMail', err => {
            if (err) {
                return this.listingConnectStage(null, -1);
            }
        });
    }
    tryAgain() {
        this.resetAll();
        this.infoTextArray([]);
        return this.imapConform();
    }
    resetAll() {
        this.showNetworkError(false);
        this.showSendConnectMail(false);
        this.showSendImapDataWarning(false);
        this.showTryAgain(false);
    }
    imapConform() {
        const self = this;
        this.showSendImapDataWarning(false);
        this.connetcError(-1);
        this.Loading(true);
        //return this.test ()
        this.listenFun = (err, stage) => {
            return self.listingConnectStage(err, stage);
        };
        _view.connectInformationMessage.socketIo.on('tryConnectCoNETStage', this.listenFun);
        _view.connectInformationMessage.sockEmit('tryConnectCoNET', err => {
            if (err) {
                return this.listingConnectStage(null, -1);
            }
        });
    }
    /**
     * 			test unit
     */
    test() {
        /**
         * 		localServerError
         */
        /*
        this.listingConnectStage ( null, 5 )
        setTimeout (() => {
            this.listingConnectStage ( null, -1 )
        }, 3000 )
        /** */
        /**
         * 		connect to mail server error
         */
        /*
        this.listingConnectStage ( null, 5 )
        setTimeout (() => {
            this.listingConnectStage ( null, -2 )
        }, 3000 )
        /** */
        /**
         * 		waiting pong
         */
        /*
        this.listingConnectStage ( null, 5 )
        setTimeout (() => {
            this.listingConnectStage ( null, 1 )
            this.listingConnectStage ( null, 2 )
        }, 3000 )
        /** */
        /**
         * 		waiting pong error automatic send request mail
         */
        /*
        this.listingConnectStage ( null, 5 )
        setTimeout (() => {
            this.listingConnectStage ( null, 1 )
            this.listingConnectStage ( null, 2 )
            setTimeout (() => {
                this.listingConnectStage ( null, 3 )
            })
        }, 3000 )
        /** */
        /**
         * 		waiting pong error automatic send request mail and timeout error
         */
        /*
        this.listingConnectStage ( null, 5 )
        setTimeout (() => {
            this.listingConnectStage ( null, 1 )
            this.listingConnectStage ( null, 2 )
            setTimeout (() => {
                this.listingConnectStage ( null, 3 )
                setTimeout (() => {
                    this.listingConnectStage ( null, 0 )
                }, 2000 )
            })
        }, 3000 )
        /** */
    }
}
