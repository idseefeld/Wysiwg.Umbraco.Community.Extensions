import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbApi } from '@umbraco-cms/backoffice/extension-api';

export class WysiwgBlockGridContextApi extends UmbContextBase implements UmbApi {
  
  constructor(host: UmbControllerHost) {
		super(host, WYSIWG_BLOCKGRID_CONTEXT);
	}
  // Define your context methods here
  getContextData() {
    return 'Hello from Wysiwg Context!';
  }
}
// Important to export as api for the Extension Registry to pick up the class:
export default WysiwgBlockGridContextApi;

export const WYSIWG_BLOCKGRID_CONTEXT = new UmbContextToken<WysiwgBlockGridContextApi>(
	"globalContext",
  "Wysiwg.GlobalContext.BlockGrid"
);

