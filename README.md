# `mobx-state-tree-persist-and-sync`

TODO - at the moment, naively the whole stores data is sent every time there
is an update, this needs to be replaced with a solution that can only send and
receive the changes within the stores.

```javascript
import {observer} from "mobx-react-lite";
import {types} from "mobx-state-tree";
import {persistAndSync} from "mobx-state-tree-persist-and-sync";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FooModel = types.model("foo").props({
	test: "hello world"
});

const BarModel = types.model("bar").props({
	test: false
});

const RootModel = types
	.model("root")
	.props({
		isHydrated: false,
		foo: FooModel,
		bar: BarModel
	})
	.actions(self => ({
		setHydrated() {
			self.isHydrated = true;
		}
	}));

const rootStore = RootModel.create({
	foo: {},
	bar: {}
});

persistAndSync(
	rootStore,
	["foo"],
	["bar"],
	AsyncStorage,
	syncUpdate //todo explain server side
).then(() => rootStore.setHydrated());

const App = observer(() => {
	if (!rootStore.isHydrated) {
		return null;
	}

	return <Text>{rootStore.foo.test}</Text>;
});
```
