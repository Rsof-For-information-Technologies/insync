"use client";

import { getProfile, updateProfile } from "@/apiCalls/userProfile/userProfile";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { useUserStore } from "@/store/user.store";
import { User } from "@/types/profile/getProfile";
import { UserRole } from "@/types/userRoles";
import { UpdateProfileSchema, updateProfileValidator } from "@/validators/tenant/updateProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "rizzui";
import { toast } from "sonner";
import Header from "../../(components)/CommonHeader";
import { Edit } from "lucide-react";
import { RxCrossCircled } from "react-icons/rx";


export default function UserProfile() {
    const t = useTranslations("ProfilePages.userProfilePage");
    const { userInfo } = useUserStore();
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (userInfo?.userId) {
                    const { data } = await getProfile({ userId: userInfo.userId });
                    setUser(data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchProfile();
    }, [userInfo]);

    const [isEditing, setIsEditing] = useState(false);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(updateProfileValidator),
        defaultValues: {
            FirstName: '',
            LastName: '',
            PhoneNumber: ''
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                FirstName: user.firstName || '',
                LastName: user.lastName || '',
                PhoneNumber: user.phoneNumber || ''
            });
        }
    }, [user, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };

    const onSubmit = async (data: UpdateProfileSchema) => {
        if (!userInfo?.userId) return;

        try {
            const updateData = {
                UserId: userInfo.userId,
                FirstName: data.FirstName,
                LastName: data.LastName,
                PhoneNumber: data.PhoneNumber,
                ProfilePicture: profilePicture
            };

            const response = await updateProfile(updateData);
            if (response.success) {
                toast.success(response.message);
                setUser(response.data);
                setIsEditing(false);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            console.error(error);
        }
    };

    return (
        <Authenticate>
            <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
                <div className="w-full h-full p-6">
                    <Header
                        title={t('title')}
                        description={t('description')}
                        actionButtons={[
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                {isEditing ? <div className="flex items-center justify-center gap-3"> <RxCrossCircled className="h-4 w-4"/> {t('actionButtons.cancel')} </div> : <div className="flex items-center justify-center gap-3"> <Edit className="h-4 w-4"/> {t('actionButtons.editProfile')} </div>}
                            </button>
                        ]}
                    />

                    {!isEditing ? (
                        <div className="bg-white grid grid-cols-1 sm:grid-cols-2 gap-8 rounded-xl shadow-sm border border-gray-200 p-6 mt-10">
                            <div className="space-y-4 flex justify-center items-center">
                                {user?.profilePicture ? (
                                    <div className="flex justify-center mb-6">
                                        <div className="relative h-[400px] w-[400px]">
                                            <Image
                                                fill
                                                src={`data:image/png;base64,${user.profilePicture}`}
                                                alt="Profile"
                                                className="rounded-full h-full w-full object-cover border-white shadow-md"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="rounded-full bg-white flex items-center justify-center border-white shadow-md"
                                        style={{ width: 350, height: 350 }}
                                        aria-label="User initials"
                                    >
                                        <span className="text-[100px] font-semibold text-gray-700">
                                            {`${(user?.firstName?.[0] ?? "").toUpperCase()}${(user?.lastName?.[0] ?? "").toUpperCase()}` || "—"}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="grid gap-8">
                                    <Input
                                        type="text"
                                        size="lg"
                                        label={t('form.firstName')}
                                        id='firstName'
                                        className="[&>label>span]:font-medium"
                                        inputClassName="text-sm"
                                        value={user?.firstName || "—"}
                                        name="firstName"
                                        disabled
                                    />
                                    <Input
                                        type="text"
                                        size="lg"
                                        label={t('form.lastName')}
                                        id='lastName'
                                        className="[&>label>span]:font-medium"
                                        inputClassName="text-sm"
                                        value={user?.lastName || "—"}
                                        name="lastName"
                                        disabled
                                    />
                                    <Input
                                        type="email"
                                        size="lg"
                                        label={t('form.email')}
                                        id='email'
                                        className="[&>label>span]:font-medium"
                                        value={user?.email || "—"}
                                        disabled
                                        name="email"
                                    />
                                    <Input
                                        type="number"
                                        size="lg"
                                        label={t('form.phoneNumber')}
                                        id='phoneNumber'
                                        className="[&>label>span]:font-medium"
                                        inputClassName="text-sm"
                                        value={user?.phoneNumber || "—"}
                                        disabled
                                        name="phoneNumber"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex justify-center items-center">
                                        {(profilePicture || user?.profilePicture) ? (
                                            <div className="relative h-[400px] w-[400px]">
                                                <Image
                                                    fill
                                                    src={profilePicture ? URL.createObjectURL(profilePicture) : `data:image/png;base64,${user?.profilePicture}`}
                                                    alt="Profile"
                                                    className="rounded-full h-full w-full object-cover border-white shadow-md"
                                                />
                                            </div>
                                        ) : (
                                            <div className="rounded-full bg-white flex items-center justify-center border-white shadow-md"
                                                style={{ width: 350, height: 350 }}>
                                                <span className="text-[100px] font-semibold text-gray-700">
                                                    {`${watch('FirstName')?.[0]?.toUpperCase() || ''}${watch('LastName')?.[0]?.toUpperCase() || ''}` || "—"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t('form.profilePicture')}
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="mt-1 py-[6px] px-4 block w-full text-sm text-gray-500 border-2 border-gray-200 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <Input
                                        type="text"
                                        size="lg"
                                        label={t('form.firstName')}
                                        placeholder={t('form.firstNamePlaceholder')}
                                        className="[&>label>span]:font-medium"
                                        inputClassName="text-sm"
                                        error={errors.FirstName?.message}
                                        {...register('FirstName')}
                                    />
                                    <Input
                                        type="text"
                                        size="lg"
                                        label={t('form.lastName')}
                                        placeholder={t('form.lastNamePlaceholder')}
                                        className="[&>label>span]:font-medium"
                                        inputClassName="text-sm"
                                        error={errors.LastName?.message}
                                        {...register('LastName')}
                                    />
                                    <Input
                                        type="email"
                                        size="lg"
                                        label={t('form.email')}
                                        placeholder={t('form.emailPlaceholder')}
                                        className="[&>label>span]:font-medium"
                                        value={user?.email || ''}
                                        disabled
                                    />
                                    <Input
                                        type="text"
                                        size="lg"
                                        label={t('form.phoneNumber')}
                                        placeholder={t('form.phoneNumberPlaceholder')}
                                        className="[&>label>span]:font-medium"
                                        inputClassName="text-sm"
                                        error={errors.PhoneNumber?.message}
                                        {...register('PhoneNumber')}
                                    />
                                    <div className="flex justify-end space-x-3">
                                        {/* <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            {t('btn.cancel')}
                                        </button> */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`px-4 py-3 bg-black text-white rounded-md text-sm font-medium ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                                                }`}
                                        >
                                            {isSubmitting ? t('btn.saving') : t('btn.saveChanges')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </Authorize>
        </Authenticate>
    );
}