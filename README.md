# `mobx-state-tree-persistence`

```javascript
import {observer} from "mobx-react-lite";
import {types} from "mobx-state-tree";
import {persist} from "mobx-state-tree-persistence";
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

persist({
	store: rootStore,
	keys: ["foo", "bar"],
	storage: AsyncStorage,
	update: localChanges => {
		...
		return remoteChanges;
	},
	keyMap: key => key.toLowerCase(),
	updateDelay: 1000,
	storageDelay: 1000
}).then(() => rootStore.setHydrated());

const App = observer(() => {
	if (!rootStore.isHydrated) {
		return null;
	}

	return <Text>{rootStore.foo.test}</Text>;
});
```
