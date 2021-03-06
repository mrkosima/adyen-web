import { Component, h } from 'preact';
import classNames from 'classnames';
import SecuredFieldsProvider from '../../../components/internal/SecuredFields/SecuredFieldsProvider';
import useCoreContext from '../../../core/Context/useCoreContext';
import Field from '../../internal/FormFields/Field';

interface GiftcardComponentProps {
    onChange: (state) => void;
    onFocus: (event) => void;
    onBlur: (event) => void;

    showPayButton?: boolean;
    payButton: (config) => any;
}

class Giftcard extends Component<GiftcardComponentProps> {
    public state = {
        status: 'ready',
        data: {},
        focusedElement: false,
        isValid: false
    };

    public static defaultProps = {
        pinRequired: true,
        onChange: () => {},
        onFocus: () => {},
        onBlur: () => {}
    };

    public sfp;

    public onChange = sfpState => {
        this.props.onChange({
            data: sfpState.data,
            isValid: sfpState.isSfpValid
        });
    };

    public showValidation = () => {
        this.sfp.showValidation();
    };

    setStatus(status) {
        this.setState({ status });
    }

    public handleFocus = e => {
        this.setState({ focusedElement: e.currentFocusObject });

        const isFocused = e.focus === true;
        if (isFocused) {
            this.props.onFocus(e);
        } else {
            this.props.onBlur(e);
        }
    };

    public handleSecuredFieldsRef = ref => {
        this.sfp = ref;
    };

    render(props, { focusedElement }) {
        const { i18n } = useCoreContext();

        return (
            <div className="adyen-checkout__giftcard">
                <SecuredFieldsProvider
                    {...this.props}
                    ref={this.handleSecuredFieldsRef}
                    onChange={this.onChange}
                    onFocus={this.handleFocus}
                    type={'giftcard'}
                    render={({ setRootNode, setFocusOn }, sfpState) => (
                        <div ref={setRootNode} className="adyen-checkout__field-wrapper">
                            <Field
                                label={i18n.get('creditCard.numberField.title')}
                                classNameModifiers={['number', ...(props.pinRequired ? ['70'] : ['100'])]}
                                errorMessage={sfpState.errors.encryptedCardNumber && i18n.get('creditCard.numberField.invalid')}
                                focused={focusedElement === 'encryptedCardNumber'}
                                onFocusField={() => setFocusOn('encryptedCardNumber')}
                            >
                                <span
                                    data-cse="encryptedCardNumber"
                                    data-info='{"length":"15-22", "maskInterval":4}'
                                    className={classNames({
                                        'adyen-checkout__input': true,
                                        'adyen-checkout__input--large': true,
                                        'adyen-checkout__card__cardNumber__input': true,
                                        'adyen-checkout__input--error': sfpState.errors.encryptedCardNumber,
                                        'adyen-checkout__input--focus': focusedElement === 'encryptedCardNumber'
                                    })}
                                />
                            </Field>

                            {props.pinRequired && (
                                <Field
                                    label={i18n.get('creditCard.pin.title')}
                                    classNameModifiers={['pin', '30']}
                                    errorMessage={sfpState.errors.encryptedSecurityCode}
                                    focused={focusedElement === 'encryptedSecurityCode'}
                                    onFocusField={() => setFocusOn('encryptedSecurityCode')}
                                >
                                    <span
                                        data-cse="encryptedSecurityCode"
                                        data-info='{"length":"3-10", "maskInterval": 0}'
                                        className={classNames({
                                            'adyen-checkout__input': true,
                                            'adyen-checkout__input--large': true,
                                            'adyen-checkout__card__cvc__input': true,

                                            'adyen-checkout__input--error': sfpState.errors.encryptedCardNumber,
                                            'adyen-checkout__input--focus': focusedElement === 'encryptedSecurityCode'
                                        })}
                                    />
                                </Field>
                            )}
                        </div>
                    )}
                />

                {this.props.showPayButton && this.props.payButton({ status: this.state.status, label: i18n.get('applyGiftcard') })}
            </div>
        );
    }
}

export default Giftcard;
